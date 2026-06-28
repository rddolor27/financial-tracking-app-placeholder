export class CategoryModel {
  id: string;
  user_id: string | null;
  name: string;
  type: string;
  icon: string | null;
  color: string | null;
  parent_id: string | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}
