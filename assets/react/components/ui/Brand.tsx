// assets\components\ui\Brand.tsx

export default function Brand() {
    return (
        <a href="/" className="flex items-center gap-2 mb-24">
            <img
                src="/images/logo_site_pulse.png"
                width="50px"
                alt="Logo"
            />
            <h1 className="font-brand text-4xl text-indigo-500 font-bold">
                SitePulse
            </h1>
        </a>
    );
}