import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const constructorState = useSelector((state) => state.burgerConstructor);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: fillings } = constructorState;
    const counters: { [key: string]: number } = {};

    fillings.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [constructorState]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
