export interface Todo {
  id: number;
  userId: number;
  title: string;
  text: string; // Normalized title
  completed: boolean;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface TodoState {
  todos: Todo[];
  /** Initial fetch in flight — full-list skeleton/spinner. */
  loading: boolean;
  /** A mutation (add/toggle/remove/edit) is in flight — disable inputs, keep list visible. */
  busy: boolean;
  error: string | null;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}
