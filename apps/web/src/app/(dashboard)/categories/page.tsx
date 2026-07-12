'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCategorySchema } from '@financial-tracker/shared-types';
import type { CategoryResponse } from '@financial-tracker/shared-types';
import { FiPlus } from 'react-icons/fi';
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/lib/crud-hooks';
import { Card, EmptyState } from '@/components/ui';

type CategoryForm = {
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color?: string;
};

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();
  const updateMutation = useUpdateCategory();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: { type: 'expense', icon: 'fa-tag', color: '#3b82f6' },
  });

  const expenseCategories = (categories as CategoryResponse[]).filter((c) => c.type === 'expense' && !c.is_hidden);
  const incomeCategories = (categories as CategoryResponse[]).filter((c) => c.type === 'income' && !c.is_hidden);

  const onSubmit = async (data: CategoryForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  const toggleHide = (category: CategoryResponse) => {
    updateMutation.mutate({ id: category.id, data: { is_hidden: !category.is_hidden } });
  };

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';

  const renderList = (title: string, list: CategoryResponse[]) => (
    <Card>
      <div className="font-bold text-[14.5px] mb-3.5">{title}</div>
      {list.length === 0 ? (
        <EmptyState>No categories.</EmptyState>
      ) : (
        <div className="flex flex-col">
          {list.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 py-2.5 border-b border-line2 last:border-none">
              <span className="w-[9px] h-[9px] rounded-[3px]" style={{ background: cat.color }} />
              <span className="text-[13px] font-semibold">{cat.name}</span>
              {cat.is_default && <span className="text-[11px] text-faint">Default</span>}
              <div className="flex-1" />
              {cat.is_default ? (
                <button onClick={() => toggleHide(cat)} className="text-[12px] text-faint hover:text-ink">
                  Hide
                </button>
              ) : (
                <button onClick={() => deleteMutation.mutate(cat.id)} className="text-[12px] text-faint hover:text-loss">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <div className="font-bold text-[16px]">Categories</div>
          <div className="text-[12px] text-faint mt-0.5">Organize income &amp; expenses</div>
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowForm((v) => !v)} className="btn-p">
          <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add category'}
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Name</label>
                <input {...register('name')} className={inputCls} placeholder="Category name" />
                {errors.name && <p className="text-loss text-[12px] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Type</label>
                <select {...register('type')} className={inputCls}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-p self-start disabled:opacity-50">
              {createMutation.isPending ? 'Creating…' : 'Create category'}
            </button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card><EmptyState>Loading categories…</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderList('Expense categories', expenseCategories)}
          {renderList('Income categories', incomeCategories)}
        </div>
      )}
    </div>
  );
}
