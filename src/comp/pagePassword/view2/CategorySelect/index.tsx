import "./style.css";

interface CategorySelectProps {
  categories: CategoryDB[];
  selectedCategory: number;
  onCategoryChange: (category: CategoryDB) => void;
  readOnly?: boolean;
}

export const CategorySelect = (props: CategorySelectProps) => {

  return (
    <div className="category-select">
      <label className="category-select-dropdown-label" htmlFor="category-select">
        Category
      </label>
      <select className="category-select-dropdown" disabled={props.readOnly} id="category-select">
        <option value={props.selectedCategory} disabled>
          {props.categories.find((cat) => cat.id === props.selectedCategory)?.titel || "Select a category"}
        </option>
        {props.categories.map((category) => (
          <option key={category.id} value={category.id} onClick={() => props.onCategoryChange(category)}>
            {category.titel}
          </option>
        ))}
      </select>
    </div>
  );
}