import api from '../api/client';
import type { User } from '../types';

/** Coerce một user DTO bất kỳ về shape `User` an toàn để render. */
function toModel(dto: unknown): User {
  const d = (typeof dto === 'object' && dto !== null ? dto : {}) as Record<string, unknown>;
  const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
  const addr = (typeof d.address === 'object' && d.address !== null ? d.address : {}) as Record<string, unknown>;
  const geo = (typeof addr.geo === 'object' && addr.geo !== null ? addr.geo : {}) as Record<string, unknown>;
  const company = (typeof d.company === 'object' && d.company !== null ? d.company : {}) as Record<string, unknown>;
  return {
    id: typeof d.id === 'number' ? d.id : 0,
    name: str(d.name, 'Unknown'),
    username: str(d.username),
    email: str(d.email),
    address: {
      street: str(addr.street),
      suite: str(addr.suite),
      city: str(addr.city),
      zipcode: str(addr.zipcode),
      geo: { lat: str(geo.lat), lng: str(geo.lng) }
    },
    phone: str(d.phone),
    website: str(d.website),
    company: {
      name: str(company.name, '—'),
      catchPhrase: str(company.catchPhrase),
      bs: str(company.bs)
    }
  };
}

class UserService {
  async getAll(): Promise<User[]> {
    const response = await api.get<unknown>('/users');
    const data = response.data;
    if (!Array.isArray(data)) {
      throw new Error('Unexpected users payload from API');
    }
    return data.map(toModel);
  }
}

export default new UserService();
