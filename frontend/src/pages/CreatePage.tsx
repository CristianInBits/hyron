import { Link } from 'react-router-dom';

function CreatePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">¿Qué vas a entrenar?</h1>
            
            <div className="grid grid-cols-1 gap-4">
                {/* Opción RUN */}
                <Link to="/run/new" className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-4 hover:bg-green-100 transition-colors">
                    <span className="text-4xl">🐕</span>
                    <div>
                        <h3 className="text-xl font-bold text-green-800">Running</h3>
                        <p className="text-green-600 text-sm">Registrar carrera</p>
                    </div>
                </Link>

                {/* Opción SWIM */}
                <Link to="/swim/new" className="p-6 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center space-x-4 hover:bg-cyan-100 transition-colors">
                    <span className="text-4xl">🦭</span>
                    <div>
                        <h3 className="text-xl font-bold text-cyan-800">Swimming</h3>
                        <p className="text-cyan-600 text-sm">Registrar natación</p>
                    </div>
                </Link>

                {/* Opción GYM */}
                <Link to="/gym/new" className="p-6 bg-purple-50 border border-purple-200 rounded-xl flex items-center space-x-4 hover:bg-purple-100 transition-colors">
                    <span className="text-4xl">🦍</span>
                    <div>
                        <h3 className="text-xl font-bold text-purple-800">Gym</h3>
                        <p className="text-purple-600 text-sm">Pesas y fuerza</p>
                    </div>
                </Link>

                {/* Opción HYROX */}
                <Link to="/hyrox/new" className="p-6 bg-orange-50 border border-orange-200 rounded-xl flex items-center space-x-4 hover:bg-orange-100 transition-colors">
                    <span className="text-4xl">🐅</span>
                    <div>
                        <h3 className="text-xl font-bold text-orange-800">Hyrox</h3>
                        <p className="text-orange-600 text-sm">Simulación o carrera</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default CreatePage;