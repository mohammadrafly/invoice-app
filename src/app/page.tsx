"use client";

import { useState } from "react";
import axios from "axios";

interface InvoiceItem {
  product_name: string;
  qty: number;
  unit?: string;
  price: number;
}

interface FormData {
  receiver: string;
  note?: string;
  items: InvoiceItem[];
}

export default function Invoice() {
  const [formData, setFormData] = useState<FormData>({
    receiver: "",
    note: "",
    items: [{ product_name: "", qty: 1, unit: "", price: 0 }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    field?: keyof InvoiceItem
  ) => {
    if (field !== undefined && index !== undefined) {
      const newItems = [...formData.items];
      newItems[index][field] = e.target.value as never;
      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { product_name: "", qty: 1, unit: "", price: 0 },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://test.ladent.id/api/generate",
        { invoice_items: formData }
      );

      const { downloadName, downloadPath } = response.data;

      const link = document.createElement("a");
      link.href = downloadPath;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Invoice PDF generated and download initiated.", downloadName);
      alert("Invoice submitted successfully!");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Failed to submit invoice.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-500 to-teal-400 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Buat Struk</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Penerima</label>
            <input
              type="text"
              name="receiver"
              value={formData.receiver}
              onChange={handleInputChange}
              required
              className="mt-2 w-full px-4 py-3 border rounded-xl text-black border-gray-300 shadow-md focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              name="note"
              value={formData.note || ""}
              onChange={handleInputChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl text-black border-gray-300 shadow-md focus:ring-2 focus:ring-teal-500"
              rows={3}
            ></textarea>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Barang/Jasa</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Product Name"
                value={item.product_name}
                onChange={(e) => handleInputChange(e, index, "product_name")}
                required
                className="w-full px-4 py-3 border rounded-xl text-black border-gray-300 shadow-md focus:ring-2 focus:ring-teal-500"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.qty}
                  min={1}
                  onChange={(e) => handleInputChange(e, index, "qty")}
                  required
                  className="px-4 py-3 border rounded-xl text-black border-gray-300 shadow-md focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={item.unit || ""}
                  onChange={(e) => handleInputChange(e, index, "unit")}
                  className="px-4 py-3 border rounded-xl text-black border-gray-300 shadow-md focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  min={0}
                  onChange={(e) => handleInputChange(e, index, "price")}
                  required
                  className="px-4 py-3 border rounded-xl text-black border-gray-300 shadow-md focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 text-sm mt-2 hover:text-red-700 focus:outline-none"
              >
                Hapus Barang/Jasa
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full bg-teal-500 text-white px-4 py-3 rounded-xl shadow-md hover:bg-teal-600"
          >
            Tambah Barang/Jasa
          </button>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-md hover:bg-indigo-700"
            >
              Print
            </button>
          </div>

          <div id="pdf-container"></div>
        </form>
      </div>
    </div>
  );
}
