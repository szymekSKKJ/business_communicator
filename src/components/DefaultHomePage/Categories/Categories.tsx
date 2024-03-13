"use client";

import styles from "./styles.module.scss";
import fridgeIcon from "../../../../public/category_icons/fridge_icon.svg";
import billsIcon from "../../../../public/category_icons/bills_icon.svg";
import croissantIcon from "../../../../public/category_icons/croissant_icon.svg";
import realEstateIcon from "../../../../public/category_icons/real_estate_icon.svg";
import sofaIcon from "../../../../public/category_icons/sofa_icon.svg";
import tractorIcon from "../../../../public/category_icons/tractor_icon.svg";
import footballIcon from "../../../../public/category_icons/football_icon.svg";
import compassIcon from "../../../../public/category_icons/compass_icon.svg";
import printerIcon from "../../../../public/category_icons/printer_icon.svg";
import cradleIcon from "../../../../public/category_icons/cradle_icon.svg";
import forkAndKnifeIcon from "../../../../public/category_icons/fork_and_knife_icon.svg";
import plantsIcon from "../../../../public/category_icons/plants__icon.svg";
import motorbikeIcon from "../../../../public/category_icons/motorbike_icon.svg";
import watchIcon from "../../../../public/category_icons/watch_icon.svg";
import courtIcon from "../../../../public/category_icons/court_icon.svg";
import truckIcon from "../../../../public/category_icons/truck_icon.svg";
import statisticsIcon from "../../../../public/category_icons/statistics_icon.svg";
import constructionIcon from "../../../../public/category_icons/construction_icon.svg";
import shoppingCartIcon from "../../../../public/category_icons/shop_cart_icon.svg";
import documentFolderIcon from "../../../../public/category_icons/document_folder_icon.svg";
import cameraIcon from "../../../../public/category_icons/camera_icon.svg";
import boneIcon from "../../../../public/category_icons/bone_icon.svg";
import laptopIcon from "../../../../public/category_icons/laptop_icon.svg";
import bookIcon from "../../../../public/category_icons/book_icon.svg";
import paintIcon from "../../../../public/category_icons/paint_icon.svg";
import headphonesIcon from "../../../../public/category_icons/headphones_icon.svg";
import studyIcon from "../../../../public/category_icons/study_icon.svg";
import fashionIcon from "../../../../public/category_icons/fashion_icon.svg";
import Category from "./Category/Category";
import Select, { Option } from "@/components/UI/Select/Select";
import Button from "@/components/UI/Button/Button";
import { signal } from "@preact/signals";
import { useSignals } from "@preact/signals-react/runtime";

const categories = signal([
  { id: 1, name: "AGD-RTV", iconImage: fridgeIcon, isActive: false },
  { id: 2, name: "Finance and insurance", iconImage: billsIcon, isActive: false },
  { id: 3, name: "Groceries", iconImage: croissantIcon, isActive: false },
  { id: 4, name: "Real estate", iconImage: realEstateIcon, isActive: false },
  { id: 5, name: "Hose and garden", iconImage: sofaIcon, isActive: false },
  { id: 6, name: "Agriculture and forestry", iconImage: tractorIcon, isActive: false },
  { id: 7, name: "Sport and recreation", iconImage: footballIcon, isActive: false },
  { id: 8, name: "Tourism and travel", iconImage: compassIcon, isActive: false },
  { id: 9, name: "Office", iconImage: printerIcon, isActive: false },
  { id: 10, name: "For kids", iconImage: cradleIcon, isActive: false },
  { id: 11, name: "Gastronomy", iconImage: forkAndKnifeIcon, isActive: false },
  { id: 12, name: "Health and beauty", iconImage: plantsIcon, isActive: false },
  { id: 13, name: "Fashion", iconImage: fashionIcon, isActive: false },
  { id: 14, name: "automotive", iconImage: motorbikeIcon, isActive: false },
  { id: 15, name: "Jewelry and watches", iconImage: watchIcon, isActive: false },
  { id: 16, name: "Public institutions", iconImage: courtIcon, isActive: false },
  { id: 17, name: "Transport and forwarding", iconImage: truckIcon, isActive: false },
  { id: 18, name: "Advice and consulting", iconImage: statisticsIcon, isActive: false },
  { id: 19, name: "construction and renovation", iconImage: constructionIcon, isActive: false },
  { id: 20, name: "Chopping centers and shops", iconImage: shoppingCartIcon, isActive: false },
  { id: 21, name: "For companies", iconImage: documentFolderIcon, isActive: false },
  { id: 22, name: "Photography", iconImage: cameraIcon, isActive: false },
  { id: 23, name: "Hobbies and animals", iconImage: boneIcon, isActive: false },
  { id: 24, name: "Computers and accessories", iconImage: laptopIcon, isActive: false },
  { id: 25, name: "Books", iconImage: bookIcon, isActive: false },
  { id: 26, name: "Culture, art and entertainment", iconImage: paintIcon, isActive: false },
  { id: 27, name: "Media and publishers", iconImage: headphonesIcon, isActive: false },
  { id: 28, name: "Study and work", iconImage: studyIcon, isActive: false },
  { id: 29, name: "All", iconImage: "", isActive: false },
]);

export const toggleActiveCategory = (id: number) => {
  const copiedValues = structuredClone(categories.value);

  const foundCategory = copiedValues.find((data) => data.id === id)!;

  foundCategory.isActive = foundCategory.isActive ? false : true;

  categories.value = copiedValues;
};

const Categories = () => {
  useSignals();

  return (
    <div className={`${styles.categories}`}>
      <h2 className={`normalText`}>Find business</h2>
      <div className={`${styles.selectElementsWrapper}`}>
        <Select>
          <Option value="Country" disabled></Option>
          <Option value="CountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountryCountry"></Option>
          <Option value="2"></Option>
          <Option value="3"></Option>
          <Option value="4"></Option>
        </Select>
        <Select>
          <Option value="Voivodeship" disabled></Option>
          <Option value="1"></Option>
          <Option value="2"></Option>
          <Option value="3"></Option>
          <Option value="4"></Option>
        </Select>
      </div>
      <div className={`${styles.categoriesWrapper}`}>
        {categories.value.map((data) => {
          const { iconImage, id, name, isActive } = data;

          return <Category key={id} id={id} name={name} iconImage={iconImage} isActive={isActive}></Category>;
        })}
      </div>
      <Button>Search</Button>
    </div>
  );
};

export default Categories;
