import logoEbenezer  from "../assets/logo-vertical.jpg"
import logoSoydeCristo2026 from "../assets/logoSoydeCristo2026-letrasNegras.png"

const NavHeader = () => {
    return (
        <header>
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
                <div className="flex flex-row items-center justify-between gap-4 md:flex-row mt-5">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                        <img
                            src={logoSoydeCristo2026}
                            alt="Logo del evento"
                            className="h-30 w-55 rounded-2xl object-cover ring-1 ring-slate-300"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <img
                            src={logoEbenezer}
                            alt="Iglesia Ebenezer Principe de Paz"
                            className="h-30 w-30 rounded-2xl object-cover ring-1 ring-slate-200"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NavHeader