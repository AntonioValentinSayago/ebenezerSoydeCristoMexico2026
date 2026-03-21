import { getMexicoDate } from "../utils/utils"
import logoEbenezer  from "../assets/logo-vertical.jpg"

const NavHeader = () => {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                        <img
                            src="https://via.placeholder.com/96x96.png?text=Evento"
                            alt="Logo del evento"
                            className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
                        />

                        <div className="text-center sm:text-left">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-900">
                                Soy de Cristo México 2026
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                                Formulario de Registro
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-slate-600">
                                { getMexicoDate() }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <img
                            src={logoEbenezer}
                            alt="Iglesia Ebenezer Principe de Paz"
                            className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NavHeader