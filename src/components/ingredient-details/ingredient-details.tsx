import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(getIngredients);
  const { id } = useParams<{ id: string }>();
  const ingredientData =
    ingredients.find((ingredient) => ingredient._id === id) ?? null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
