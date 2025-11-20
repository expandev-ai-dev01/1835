import { Routes, Route } from 'react-router-dom';
import { PurchaseList } from './_impl/PurchaseList';
import { PurchaseForm } from './_impl/PurchaseForm';

export const PurchasePage = () => {
  return (
    <Routes>
      <Route index element={<PurchaseList />} />
      <Route path="new" element={<PurchaseForm />} />
      <Route path=":id/edit" element={<PurchaseForm />} />
    </Routes>
  );
};

export default PurchasePage;
