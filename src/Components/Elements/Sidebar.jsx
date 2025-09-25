import React, { useState } from "react";
import MenuIcon from "../../assets/menu.png";
import CloseIcon from "../../assets/close.png";

export default function Sidebar() {
  const [open, setOpen] = useState(false); // sidebar mobile
  const [showFormHitung, setShowFormHitung] = useState(false); // toggle Hitung KPR
  const [showFormSimulasi, setShowFormSimulasi] = useState(false); // toggle Simulasi KPR

  return (
    <>
      {/* // Sidebar Desktop // */}
      <aside className="hidden md:flex flex-col sticky top-0 w-1/4 p-6 bg-amber-100 min-h-screen overflow-y-auto pb-20">
        <p className="text-xl font-bold justify-center text-justify-center">
          Tentukan solusi biaya rumah yang sesuai dengan kemampuan dan finansial
          kamu!
        </p>
        <div className="flex flex-col items-center justify-center h-full w-full gap-y-5">
          {/* /* Bagian atas (Hitung KPR) */}
          <div className="flex flex-col items-center w-full">
            <button
              onClick={() => {
                setShowFormHitung(!showFormHitung);
                setShowFormSimulasi(false);
              }}
              className="w-4/5 py-6 text-xl font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700"
            >
              Hitung KPR
            </button>

            {showFormHitung && (
              <div className="w-4/5 bg-gray-100 rounded-xl shadow-lg overflow-hidden mt-4">
                <div className="bg-green-200 py-3 text-center">
                  <h2 className="text-xl font-bold text-black">Hitung KPR</h2>
                </div>
                <form className="p-4 space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Harga Properti
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Uang Muka (DP)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Tenor Angsuran
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <span className=" text-gray-700 text-sm">Tahun</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Bank dan Program KPR
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                  >
                    Hitung
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bagian bawah (Simulasi KPR) */}
          <div className="flex flex-col items-center w-full">
            <button
              onClick={() => {
                setShowFormSimulasi(!showFormSimulasi);
                setShowFormHitung(false);
              }}
              className="w-4/5 py-6 text-xl font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700"
            >
              Simulasi KPR
            </button>

            {showFormSimulasi && (
              <div className="w-4/5 bg-gray-100 rounded-xl shadow-lg overflow-hidden mt-4">
                <div className="bg-green-200 py-3 text-center">
                  <h2 className="text-xl font-bold text-black">Simulasi KPR</h2>
                </div>
                <form className="p-4 space-y-4">
                  {/* Penghasilan Bulanan */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Penghasilan Bulanan
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      *Masukkan total penghasilan menyeluruh
                    </p>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Cicilan Aktif */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Cicilan Bulanan Aktif
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      *Masukkan cicilan yang sedang aktif (isi 0 jika tidak
                      ada).
                    </p>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Kesanggupan Uang Muka */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Kesanggupan Uang Muka
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                  >
                    Hitung
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Header Sidebar (Mobile) */}
      <div className="md:hidden sticky top-0 flex flex-col items-center p-4 bg-amber-100 z-40 shadow">
        <h2 className="text-xl font-bold text-green-700">Menu</h2>
        <img
          src={MenuIcon}
          alt="menu"
          width="25"
          height="25"
          className="cursor-pointer mt-2"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* Overlay hitam */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-amber-100 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center p-6 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4">
          <img
            src={CloseIcon}
            alt="close"
            width="30"
            height="30"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex flex-col items-center w-full gap-y-8 mt-12">
          <p>
            Tentukan Solusi biaya rumah yang sesuai dengan kemampuan dan
            finansial kamu!
          </p>

          {/* Tombol Hitung KPR Mobile */}
          <div className="flex flex-col items-center w-full">
            <button
              onClick={() => {
                setShowFormHitung(!showFormHitung);
                setShowFormSimulasi(false);
              }}
              className="w-4/5 py-6 text-xl font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700"
            >
              Hitung KPR
            </button>
            {showFormHitung && (
              <div className="w-4/5 bg-gray-100 rounded-xl shadow-lg overflow-hidden mt-4">
                <div className="bg-green-200 py-3 text-center">
                  <h2 className="text-xl font-bold text-black">Hitung KPR</h2>
                </div>
                <form className="p-4 space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Harga Properti
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Uang Muka (DP)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Tenor Angsuran
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="flex-shrink-0 text-gray-700 text-sm">
                        Tahun
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Bank dan Program KPR
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                  >
                    Hitung
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Tombol Simulasi KPR Mobile */}
          <div className="flex flex-col items-center w-full">
            <button
              onClick={() => {
                setShowFormSimulasi(!showFormSimulasi);
                setShowFormHitung(false);
              }}
              className="w-4/5 py-6 text-xl font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700"
            >
              Simulasi KPR
            </button>
            {showFormSimulasi && (
              <div className="w-4/5 bg-gray-100 rounded-xl shadow-lg overflow-hidden mt-4">
                <div className="bg-green-200 py-3 text-center">
                  <h2 className="text-xl font-bold text-black">Simulasi KPR</h2>
                </div>
                <form className="p-4 space-y-4">
                  {/* Penghasilan Bulanan */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Penghasilan Bulanan
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      *Masukkan total penghasilan menyeluruh
                    </p>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Cicilan Aktif */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Cicilan Bulanan Aktif
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      *Masukkan cicilan yang sedang aktif (isi 0 jika tidak
                      ada).
                    </p>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Kesanggupan Uang Muka */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Kesanggupan Uang Muka
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                  >
                    Hitung
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
