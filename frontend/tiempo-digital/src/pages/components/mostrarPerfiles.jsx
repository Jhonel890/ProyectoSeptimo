import React from "react";

export default function MostrarPerfiles({ perfiles }) {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Perfiles Asociados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perfiles.map((perfil, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg shadow-md ${
                            index % 2 === 0 ? "bg-blue-100" : "bg-green-100"
                        }`}
                    >
                        <p className="text-lg font-semibold text-gray-700">
                            {perfil.nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                            Asociado el:{" "}
                            {new Date(perfil.persona_perfil.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}