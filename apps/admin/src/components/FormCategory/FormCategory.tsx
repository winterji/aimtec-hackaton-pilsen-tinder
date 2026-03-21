import React from 'react';
import { useForm } from 'react-hook-form';
import { Category } from '@/types';
import { saveCategory } from '@/services/categories.service';

interface CategoryFormProps {
  initialData?: Category; // Pokud přijde, upravujeme. Pokud ne, tvoříme novou.
  onSuccess?: () => void; // Co se stane po úspěšném uložení (např. zavření modálního okna)
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Category>({
    defaultValues: initialData || { id: '', name: '', icon: '', description: '' }
  });

  const onSubmit = async (data: Category) => {
    try {
      await saveCategory(data);
      alert(initialData ? 'Kategorie upravena!' : 'Kategorie vytvořena!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Chyba při ukládání kategorie:', error);
      alert('Něco se pokazilo.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">ID (např. pamatky)</label>
        <input 
          {...register('id', { required: 'ID je povinné' })} 
          readOnly={!!initialData} // Při úpravě nedovolíme změnit ID
          className={`mt-1 block w-full rounded-md border p-2 ${initialData ? 'bg-gray-100' : 'border-gray-300'}`} 
        />
        {errors.id && <span className="text-red-500 text-sm">{errors.id.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Název (např. Památky)</label>
        <input 
          {...register('name', { required: 'Název je povinný' })} 
          className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ikona (Emoji nebo URL)</label>
        <input 
          {...register('icon', { required: 'Ikona je povinná' })} 
          className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Popis</label>
        <textarea 
          {...register('description', { required: 'Popis je povinný' })} 
          className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
          rows={3}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Ukládám...' : 'Uložit kategorii'}
      </button>
    </form>
  );
};