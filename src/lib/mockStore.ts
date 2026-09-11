import { Album, Photo, PhotographerProfile, SSEHeartEvent } from '../types/index.ts';

// Danh sách ảnh mẫu chất lượng cao cho tiệc cưới & chân dung
const SAMPLE_PREVIEWS = [
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=480&q=80',
    title: 'Khoảnh khắc trao nhẫn lễ đường',
  },
  {
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=480&q=80',
    title: 'Nụ cười cô dâu rạng rỡ',
  },
  {
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=480&q=80',
    title: 'Bước vào lễ đường hạnh phúc',
  },
  {
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=480&q=80',
    title: 'Trao nhau ánh mắt thề nguyện',
  },
  {
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=480&q=80',
    title: 'Ngoại cảnh rừng thông Đà Lạt hoàng hôn',
  },
  {
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=480&q=80',
    title: 'Bàn tiệc hoa tươi phong cách rustic',
  },
  {
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=480&q=80',
    title: 'Chiếc váy cưới đuôi cá tinh khôi',
  },
  {
    url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=480&q=80',
    title: 'Gia đình hai bên chúc mừng hạnh phúc',
  },
  {
    url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=480&q=80',
    title: 'Bó hoa cưới tulip trắng thanh lịch',
  },
  {
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=480&q=80',
    title: 'Nhẫn cưới bạch kim đính kim cương',
  },
  {
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=480&q=80',
    title: 'Khoảnh khắc khiêu vũ mở màn',
  },
  {
    url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=85',
    thumb: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=480&q=80',
    title: 'Rót tháp rượu champagne ấm áp',
  },
];

const INITIAL_PROFILE: PhotographerProfile = {
  id: 'usr_photographer_01',
  name: 'Quang Lê Photography',
  email: 'quangle.studio@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  isDriveConnected: true,
  driveEmail: 'quangle.studio@gmail.com',
  activeAlbumsCount: 2,
  maxAlbumsLimit: 3,
  maxPhotosLimit: 1500,
  albumLifespanDays: 30,
};

const INITIAL_ALBUMS: Album[] = [
  {
    id: 'album_dalat_wedding',
    title: 'Tiệc cưới Tuấn & Trang — Đà Lạt',
    folderUrl: 'https://drive.google.com/drive/folders/18A3xZ9K2mP0L7q_DalatWedding2026',
    folderId: '18A3xZ9K2mP0L7q_DalatWedding2026',
    shareId: 'tuan-trang-wedding',
    passcode: '1234',
    status: 'ready',
    totalPhotos: 78,
    importedPhotos: 78,
    selectedPhotosCount: 42,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString(),
    readyAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    guestSessionCount: 3,
  },
  {
    id: 'album_engagement_hanoi',
    title: 'Lễ đính hôn Khánh & Vy — Hà Nội',
    folderUrl: 'https://drive.google.com/drive/folders/1bC4dEf9_DinhHonKhanhVyHanoi',
    folderId: '1bC4dEf9_DinhHonKhanhVyHanoi',
    shareId: 'khanh-vy-dinhhon',
    passcode: '8888',
    status: 'importing',
    totalPhotos: 850,
    importedPhotos: 340,
    selectedPhotosCount: 0,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    coverUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    guestSessionCount: 0,
  },
  {
    id: 'album_portrait_workshop',
    title: 'Workshop Portrait Studio Mùa Thu',
    folderUrl: 'https://drive.google.com/drive/folders/1xYz889_WorkshopStudioFall',
    folderId: '1xYz889_WorkshopStudioFall',
    shareId: 'workshop-portrait',
    passcode: '2026',
    status: 'needs_attention',
    totalPhotos: 120,
    importedPhotos: 119,
    selectedPhotosCount: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    errorMessage: 'Có 1 ảnh vượt quá giới hạn 50MB (DSC_9832.JPG - 68.4MB). Vui lòng nén hoặc xóa ảnh này trên Drive để tiếp tục.',
    guestSessionCount: 0,
  },
];

// Tạo 78 photos cho album_dalat_wedding
function generatePhotosForDalatAlbum(): Photo[] {
  const photos: Photo[] = [];
  for (let i = 1; i <= 78; i++) {
    const sample = SAMPLE_PREVIEWS[(i - 1) % SAMPLE_PREVIEWS.length];
    const isSelected = i <= 42; // 42 ảnh đã được tim
    const pad = i.toString().padStart(4, '0');
    photos.push({
      id: `photo_dalat_${i}`,
      albumId: 'album_dalat_wedding',
      driveFileId: `1drive_file_key_${pad}_dalat`,
      name: `DSC_${pad}.JPG`,
      thumbnailUrl: sample.thumb,
      previewUrl: sample.url,
      originalUrl: `https://drive.google.com/uc?export=view&id=1drive_file_key_${pad}_dalat`,
      isSelected,
      selectedAt: isSelected ? new Date(Date.now() - (78 - i) * 60 * 1000).toISOString() : undefined,
      sizeBytes: Math.floor(12 * 1024 * 1024 + (i * 350000) % 25000000), // ~12MB - 37MB (<50MB)
      dimensions: {
        width: 6000,
        height: 4000,
      },
      status: 'ready',
    });
  }
  return photos;
}

class MockStore {
  private profile: PhotographerProfile = { ...INITIAL_PROFILE };
  private albums: Album[] = [...INITIAL_ALBUMS];
  private photosByAlbum: Record<string, Photo[]> = {
    album_dalat_wedding: generatePhotosForDalatAlbum(),
    album_engagement_hanoi: [],
    album_portrait_workshop: [],
  };
  private guestSessions: Record<string, boolean> = {}; // shareId -> verified
  private simulateNetworkError = false;
  private listeners: Array<() => void> = [];

  constructor() {
    this.recalculateActiveAlbums();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private recalculateActiveAlbums() {
    // Chỉ tính các album chưa hết hạn
    const active = this.albums.filter((a) => {
      const remaining = new Date(a.expiresAt).getTime() - Date.now();
      return remaining > 0;
    }).length;
    this.profile.activeAlbumsCount = active;
  }

  public getProfile(): PhotographerProfile {
    return { ...this.profile };
  }

  public getAlbums(): Album[] {
    return [...this.albums];
  }

  public getAlbumById(id: string): Album | undefined {
    return this.albums.find((a) => a.id === id);
  }

  public getAlbumByShareId(shareId: string): Album | undefined {
    return this.albums.find((a) => a.shareId.toLowerCase() === shareId.toLowerCase());
  }

  public getPhotos(albumId: string): Photo[] {
    return this.photosByAlbum[albumId] || [];
  }

  public toggleDriveConnection() {
    this.profile.isDriveConnected = !this.profile.isDriveConnected;
    this.notify();
  }

  public createAlbum(data: { name: string; folderUrl: string; passcode: string }): {
    success: boolean;
    error?: string;
    album?: Album;
  } {
    if (this.profile.activeAlbumsCount >= this.profile.maxAlbumsLimit) {
      return {
        success: false,
        error: `Bạn đã đạt hạn mức tối đa ${this.profile.maxAlbumsLimit} album hoạt động. Vui lòng xóa album cũ để tạo mới.`,
      };
    }

    const shareId = data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `album-${Date.now().toString().slice(-4)}`;

    const newAlbum: Album = {
      id: `album_${Date.now()}`,
      title: data.name,
      folderUrl: data.folderUrl,
      folderId: `folder_${Date.now()}`,
      shareId,
      passcode: data.passcode,
      status: 'ready',
      totalPhotos: 24,
      importedPhotos: 24,
      selectedPhotosCount: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      readyAt: new Date().toISOString(),
      coverUrl: SAMPLE_PREVIEWS[0].url,
      guestSessionCount: 0,
    };

    // Tạo ảnh mẫu cho album mới
    const photos: Photo[] = [];
    for (let i = 1; i <= 24; i++) {
      const sample = SAMPLE_PREVIEWS[(i - 1) % SAMPLE_PREVIEWS.length];
      const pad = i.toString().padStart(4, '0');
      photos.push({
        id: `photo_${newAlbum.id}_${i}`,
        albumId: newAlbum.id,
        driveFileId: `drive_file_${newAlbum.id}_${pad}`,
        name: `IMG_${pad}.JPG`,
        thumbnailUrl: sample.thumb,
        previewUrl: sample.url,
        originalUrl: `https://drive.google.com/open?id=drive_file_${newAlbum.id}_${pad}`,
        isSelected: false,
        sizeBytes: 15 * 1024 * 1024,
        dimensions: { width: 6000, height: 4000 },
        status: 'ready',
      });
    }

    this.albums.unshift(newAlbum);
    this.photosByAlbum[newAlbum.id] = photos;
    this.recalculateActiveAlbums();
    this.notify();

    return { success: true, album: newAlbum };
  }

  public retryAlbum(albumId: string) {
    const album = this.albums.find((a) => a.id === albumId);
    if (!album) return;

    album.status = 'importing';
    album.errorMessage = undefined;
    this.notify();

    // Giả lập xử lý hoàn tất sau 2.5s
    setTimeout(() => {
      album.status = 'ready';
      album.importedPhotos = album.totalPhotos;
      album.readyAt = new Date().toISOString();
      // Bổ sung photos cho album
      if (!this.photosByAlbum[albumId] || this.photosByAlbum[albumId].length === 0) {
        const photos: Photo[] = [];
        for (let i = 1; i <= 15; i++) {
          const sample = SAMPLE_PREVIEWS[(i - 1) % SAMPLE_PREVIEWS.length];
          const pad = i.toString().padStart(4, '0');
          photos.push({
            id: `photo_${albumId}_${i}`,
            albumId: albumId,
            driveFileId: `drive_retried_${pad}`,
            name: `WORKSHOP_${pad}.JPG`,
            thumbnailUrl: sample.thumb,
            previewUrl: sample.url,
            originalUrl: `https://drive.google.com/open?id=drive_retried_${pad}`,
            isSelected: false,
            sizeBytes: 18 * 1024 * 1024,
            dimensions: { width: 6000, height: 4000 },
            status: 'ready',
          });
        }
        this.photosByAlbum[albumId] = photos;
      }
      this.recalculateActiveAlbums();
      this.notify();
    }, 2500);
  }

  public deleteAlbum(albumId: string) {
    this.albums = this.albums.filter((a) => a.id !== albumId);
    delete this.photosByAlbum[albumId];
    this.recalculateActiveAlbums();
    this.notify();
  }

  public updateAlbumPasscode(albumId: string, newPasscode: string) {
    const album = this.albums.find((a) => a.id === albumId);
    if (album) {
      album.passcode = newPasscode;
      // Thu hồi toàn bộ phiên khách theo plan.md
      delete this.guestSessions[album.shareId];
      album.guestSessionCount = 0;
      this.notify();
    }
  }

  public revokeGuestSessions(albumId: string) {
    const album = this.albums.find((a) => a.id === albumId);
    if (album) {
      delete this.guestSessions[album.shareId];
      album.guestSessionCount = 0;
      this.notify();
    }
  }

  public toggleHeart(albumId: string, photoId: string, isSelected: boolean): boolean {
    if (this.simulateNetworkError) {
      // Giả lập lỗi mạng
      return false;
    }

    const photos = this.photosByAlbum[albumId];
    if (!photos) return false;

    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return false;

    photo.isSelected = isSelected;
    photo.selectedAt = isSelected ? new Date().toISOString() : undefined;

    // Cập nhật count trên album
    const album = this.albums.find((a) => a.id === albumId);
    if (album) {
      album.selectedPhotosCount = photos.filter((p) => p.isSelected).length;
    }

    this.notify();
    return true;
  }

  // Giả lập sự kiện SSE từ khách khác
  public simulateIncomingSSE(albumId: string): SSEHeartEvent | null {
    const photos = this.photosByAlbum[albumId];
    if (!photos || photos.length === 0) return null;

    // Chọn ngẫu nhiên 1 ảnh
    const randomIdx = Math.floor(Math.random() * photos.length);
    const photo = photos[randomIdx];
    const newSelected = !photo.isSelected;
    photo.isSelected = newSelected;
    photo.selectedAt = newSelected ? new Date().toISOString() : undefined;

    const album = this.albums.find((a) => a.id === albumId);
    if (album) {
      album.selectedPhotosCount = photos.filter((p) => p.isSelected).length;
    }

    this.notify();

    return {
      albumId,
      photoId: photo.id,
      photoName: photo.name,
      isSelected: newSelected,
      timestamp: new Date().toISOString(),
      totalSelected: album ? album.selectedPhotosCount : 0,
    };
  }

  public verifyGuestPasscode(shareId: string, passcode: string): boolean {
    const album = this.getAlbumByShareId(shareId);
    if (!album) return false;

    if (album.passcode === passcode) {
      this.guestSessions[shareId] = true;
      album.guestSessionCount += 1;
      this.notify();
      return true;
    }
    return false;
  }

  public isGuestVerified(shareId: string): boolean {
    return !!this.guestSessions[shareId];
  }

  public setSimulateNetworkError(val: boolean) {
    this.simulateNetworkError = val;
    this.notify();
  }

  public getSimulateNetworkError(): boolean {
    return this.simulateNetworkError;
  }

  public resetStore() {
    this.profile = { ...INITIAL_PROFILE };
    this.albums = [...INITIAL_ALBUMS];
    this.photosByAlbum = {
      album_dalat_wedding: generatePhotosForDalatAlbum(),
      album_engagement_hanoi: [],
      album_portrait_workshop: [],
    };
    this.guestSessions = {};
    this.simulateNetworkError = false;
    this.recalculateActiveAlbums();
    this.notify();
  }
}

export const store = new MockStore();
