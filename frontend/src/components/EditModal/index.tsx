import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface EditModalButtonProps {
    title?: string;
    children: React.ReactNode;
    isOpen: boolean;        
    onClose: () => void;    
  }
  
  const EditModalButton: React.FC<EditModalButtonProps> = ({
    title = "Edit Item",
    children,
    isOpen,
    onClose,   
  }) => {
    return (
      <>

  
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white max-w-lg w-full rounded-xl shadow-lg p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-bold text-black">{title}</Dialog.Title>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X />
                </button>
              </div>
              {children}
            </Dialog.Panel>
          </div>
        </Dialog>
      </>
    );
  };
  
  export default EditModalButton;
  