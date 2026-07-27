import React from 'react';
import { useStore } from './context/StoreContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './components/views/Dashboard';
import MedicineCatalog from './components/views/MedicineCatalog';
import Suppliers from './components/views/Suppliers';
import POSBilling from './components/views/POSBilling';
import Reports from './components/views/Reports';
import AddMedicineModal from './components/modals/AddMedicineModal';
import AddSupplierModal from './components/modals/AddSupplierModal';
import ReceiptModal from './components/modals/ReceiptModal';
import ToastContainer from './components/layout/ToastContainer';
import LoginScreen from './components/views/LoginScreen';

function App() {
  const { userSession, activeTab } = useStore();

  if (!userSession) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <MedicineCatalog />;
      case 'suppliers': return <Suppliers />;
      case 'sales': return <POSBilling />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <Sidebar />
      <main className="main-wrapper">
        <TopBar />
        <div className="content-container">
          <div className="tab-panel active">
            {renderActiveTab()}
          </div>
        </div>
      </main>
      
      <AddMedicineModal />
      <AddSupplierModal />
      <ReceiptModal />
      <ToastContainer />
    </>
  );
}

export default App;
