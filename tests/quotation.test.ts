import { describe, expect, it } from "vitest";
import {
  quotationDraftSchema,
  quotationSchema,
} from "../src/features/quotation/schemas/quotation.schema";
import {
  createDay,
  createQuotation,
  createService,
  dayAmount,
  formatMoney,
  quoteAmount,
  quoteFilename,
  serviceAmount,
} from "../src/features/quotation/utils/quotation";
import {
  draftKey,
  readDraft,
  saveDraft,
} from "../src/features/quotation/utils/draft";

function sampleQuote() {
  const quote = createQuotation("Studio của bạn");
  quote.customerName = "Minh Anh & Hoàng Nam";
  quote.issuedOn = "2026-09-07";
  quote.days = [
    {
      ...createDay(),
      date: "2026-12-15",
      services: [
        {
          ...createService(),
          name: "Chụp ảnh",
          quantity: "3",
          unitPrice: "3000000",
        },
        {
          ...createService(),
          name: "Quay phim",
          quantity: "1",
          unitPrice: "4000000",
        },
      ],
    },
    {
      ...createDay(),
      date: "2026-12-13",
      services: [
        {
          ...createService(),
          name: "Chụp ảnh",
          quantity: "1",
          unitPrice: "3000000",
        },
        {
          ...createService(),
          name: "Quay phim",
          quantity: "1",
          unitPrice: "5000000",
        },
      ],
    },
    {
      ...createDay(),
      date: "2026-12-14",
      services: [
        {
          ...createService(),
          name: "Chụp ảnh",
          quantity: "1",
          unitPrice: "2500000",
        },
      ],
    },
  ];
  return quote;
}
function memoryStorage() {
  const entries = new Map<string, string>();
  return {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  };
}

describe("quotation amounts and validation", () => {
  it("matches the three-day reference and preserves input order", () => {
    const quote = sampleQuote();
    expect(quotationSchema.safeParse(quote).success).toBe(true);
    expect(quote.days.map(dayAmount)).toEqual([13000000, 8000000, 2500000]);
    expect(quoteAmount(quote)).toBe(23500000);
    expect(formatMoney(quoteAmount(quote))).toBe("23.500.000");
    expect(quote.days.map((day) => day.date)).toEqual([
      "2026-12-15",
      "2026-12-13",
      "2026-12-14",
    ]);
  });
  it("updates totals when days and services are added, edited or removed", () => {
    const quote = sampleQuote();
    quote.days[0].services[0].quantity = "2";
    expect(quoteAmount(quote)).toBe(20500000);
    quote.days[1].services.splice(1, 1);
    expect(quoteAmount(quote)).toBe(15500000);
    quote.days.splice(0, 1);
    expect(quoteAmount(quote)).toBe(5500000);
    quote.days.push({
      ...createDay(),
      services: [{ ...createService(), name: "In ảnh", unitPrice: "100000" }],
    });
    expect(quoteAmount(quote)).toBe(5600000);
  });
  it("gives new days and services stable distinct IDs", () => {
    const rows = [createService(), createService(), createDay().services[0]];
    expect(new Set(rows.map((row) => row.id)).size).toBe(3);
    expect(createDay().id).not.toBe(createDay().id);
  });
  it.each(["", "0", "-1", "1.5", "abc", "Infinity", "9007199254740992"])(
    "rejects quantity %j without NaN in preview",
    (quantity) => {
      const quote = sampleQuote();
      quote.days[0].services[0].quantity = quantity;
      expect(quotationSchema.safeParse(quote).success).toBe(false);
      expect(serviceAmount(quote.days[0].services[0])).toBe(0);
      expect(Number.isFinite(quoteAmount(quote))).toBe(true);
    },
  );
  it.each(["", "-1", "1.5", "abc", "Infinity"])(
    "rejects price %j",
    (unitPrice) => {
      const quote = sampleQuote();
      quote.days[0].services[0].unitPrice = unitPrice;
      expect(quotationSchema.safeParse(quote).success).toBe(false);
      expect(serviceAmount(quote.days[0].services[0])).toBe(0);
    },
  );
  it("accepts free services and reports missing fields at their inputs", () => {
    const quote = sampleQuote();
    quote.days[0].services[0].unitPrice = "0";
    expect(quotationSchema.safeParse(quote).success).toBe(true);
    quote.customerName = "";
    quote.days[0].date = "";
    quote.days[0].services[0].name = "";
    const result = quotationSchema.safeParse(quote);
    if (result.success) throw new Error("Expected invalid quote");
    expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual(
      expect.arrayContaining([
        "customerName",
        "days.0.date",
        "days.0.services.0.name",
      ]),
    );
  });
  it.each(["2026-02-30", "2026-13-01", "2026-1-1", "0000-01-01"])(
    "rejects invalid calendar date %s",
    (date) => {
      const quote = sampleQuote();
      quote.issuedOn = date;
      expect(quotationSchema.safeParse(quote).success).toBe(false);
    },
  );
  it("rejects reversed hours and unsafe amounts", () => {
    const quote = sampleQuote();
    quote.days[0].endTime = "06:00";
    expect(quotationSchema.safeParse(quote).success).toBe(false);
    quote.days[0].endTime = "17:00";
    quote.days[0].services[0].unitPrice = "9007199254740991";
    expect(quotationSchema.safeParse(quote).success).toBe(false);
  });
  it("requires at least one day and service", () => {
    const quote = sampleQuote();
    quote.days[0].services = [];
    expect(quotationSchema.safeParse(quote).success).toBe(false);
    quote.days = [];
    expect(quotationSchema.safeParse(quote).success).toBe(false);
  });
  it("creates a safe Vietnamese filename", () => {
    expect(quoteFilename(sampleQuote())).toBe(
      "bao-gia-minh-anh-hoang-nam-2026-09-07.png",
    );
  });
});

describe("local quotation drafts", () => {
  it("restores existing drafts created before quotation codes were added", () => {
    const storage = memoryStorage();
    const quote = sampleQuote();
    delete quote.code;
    storage.setItem(draftKey("owner"), JSON.stringify(quote));
    expect(readDraft(storage, "owner")).toEqual({
      draft: { ...quote, code: "" },
      error: false,
    });
  });
  it("restores unfinished input and a logo without enforcing export validation", () => {
    const storage = memoryStorage();
    const quote = createQuotation("Studio");
    quote.brand.logo = "data:image/png;base64,aGVsbG8=";
    expect(quotationDraftSchema.safeParse(quote).success).toBe(true);
    expect(quotationSchema.safeParse(quote).success).toBe(false);
    expect(saveDraft(storage, "owner-a", quote)).toBe(true);
    expect(readDraft(storage, "owner-a")).toEqual({
      draft: quote,
      error: false,
    });
  });
  it("isolates drafts by account", () => {
    const storage = memoryStorage();
    saveDraft(storage, "owner-a", sampleQuote());
    expect(readDraft(storage, "owner-b")).toEqual({
      draft: null,
      error: false,
    });
  });
  it.each([
    "{",
    "{}",
    JSON.stringify({ ...sampleQuote(), schemaVersion: 2 }),
    JSON.stringify({ ...sampleQuote(), themeId: "unknown" }),
  ])("recovers from a corrupted or unsupported draft", (raw) => {
    const storage = memoryStorage();
    storage.setItem(draftKey("owner"), raw);
    expect(readDraft(storage, "owner")).toEqual({ draft: null, error: true });
  });
  it("reports storage denial and quota failure without throwing", () => {
    const storage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(readDraft(storage, "owner")).toEqual({ draft: null, error: true });
    expect(saveDraft(storage, "owner", sampleQuote())).toBe(false);
  });
  it("rejects remote or active-content logo sources in restored data", () => {
    const quote = sampleQuote();
    quote.brand.logo = "https://example.com/logo.svg";
    expect(quotationDraftSchema.safeParse(quote).success).toBe(false);
  });
});
