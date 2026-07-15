export type UserRole = "admin" | "editor" | "viewer";

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
}

export interface Term {
  id: string;
  term: string;
  definition: string;
  created_by: string;
  created_at: string;
  creator?: Pick<Profile, "name"> | null;
}

export interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  timestamp: string;
  user?: Pick<Profile, "name"> | null;
}

export interface Database {
  public: {
    Tables: {
      users: { Row: Profile; Insert: Profile; Update: Partial<Omit<Profile, "id">> };
      terms: { Row: Term; Insert: Omit<Term, "id" | "created_at" | "creator">; Update: Partial<Pick<Term, "term" | "definition">> };
      audit_logs: { Row: AuditLog; Insert: Omit<AuditLog, "id" | "timestamp" | "user">; Update: never };
    };
  };
}
