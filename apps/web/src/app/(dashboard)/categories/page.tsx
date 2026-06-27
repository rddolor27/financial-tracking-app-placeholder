'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCategorySchema } from '@financial-tracker/shared-types';
import type { CategoryResponse } from '@financial-tracker/shared-types';
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/lib/crud-hooks';

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
    defaultValues: { type: 'expense', icon: 'fa-tag', color: '#808080' },
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-zinc-500">Loading categories...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Expense Categories</h2>
            <div className="space-y-2">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-lg px-4 py-3 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium">{cat.name}</span>
                    {cat.is_default && <span className="text-xs text-zinc-400">Default</span>}
                  </div>
                  <div className="flex gap-2">
                    {cat.is_default ? (
                      <button onClick={() => toggleHide(cat)} className="text-xs text-zinc-400 hover:text-zinc-600">
                        Hide
                      </button>
                    ) : (
                      <button onClick={() => deleteMutation.mutate(cat.id)} className="text-xs text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Income Categories</h2>
            <div className="space-y-2">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-lg px-4 py-3 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium">{cat.name}</span>
                    {cat.is_default && <span className="text-xs text-zinc-400">Default</span>}
                  </div>
                  <div className="flex gap-2">
                    {cat.is_default ? (
                      <button onClick={() => toggleHide(cat)} className="text-xs text-zinc-400 hover:text-zinc-600">
                        Hide
                      </button>
                    ) : (
                      <button onClick={() => deleteMutation.mutate(cat.id)} className="text-xs text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
