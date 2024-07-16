import { IoClose } from "react-icons/io5";

const FileDrop = ({
  uploadedFile,
  dragging,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleRemoveFile,
}) => {
  return (
    <div className="bg-blue-50 py-5 px-5 mt-3 border w-full">
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-sm"
            >
              Cargar imagen o archivo
            </label>
          </div>
        </div>
        <div
          className={`border-2 border-dashed border-gray-300 p-6 text-center ${
            dragging ? "bg-gray-100" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="relative">
              <p className="text-gray-600">
                Archivo cargado: {uploadedFile.name}
              </p>
              {uploadedFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Vista previa"
                  className="mt-4 mx-auto rounded w-1/2"
                />
              ) : (
                <embed
                  src={URL.createObjectURL(uploadedFile)}
                  type="application/pdf"
                  className="mt-4 mx-auto w-full h-64"
                  alt="Vista previa PDF"
                />
              )}
              <button
                onClick={handleRemoveFile}
                className="absolute top-[-20px] right-[-19px] text-red-600 bg-red-100 rounded-full py-2 px-2 hover:text-red-700"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div>
              <div className="text-gray-500">
                Arrastra y suelta o{" "}
                <span className="text-blue-500 cursor-pointer">
                  carga tu imagen o archivo aquí
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Máximo disponible para subir <b>una</b> imagen o archivo.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDrop;
