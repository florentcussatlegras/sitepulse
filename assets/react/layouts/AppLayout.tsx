// assets\react\layouts\Applayout.tsx

import { Outlet, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Dashboard from "../pages/Dashboard";
import DashboardSkeleton from "../components/skeleton/DashboardSkeleton";
import Brand from "../components/ui/Brand";

type AuditResults = {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
};

function auditSummary(results: AuditResults) {
    if (results.performance < 70)
        return "Votre site peut nettement gagner en performance.";
    if (results.seo < 75)
        return "Votre SEO est perfectible avec quelques optimisations.";
    return "Votre site est globalement bien optimisé 👍";
}

export default function AppLayout() {
    const steps = [
        "Analyse de la performance…",
        "Vérification SEO…",
        "Audit accessibilité…",
        "Bonnes pratiques…",
    ];

    const [stepIndex, setStepIndex] = useState(0);
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AuditResults | null>(null);
    const [auditId, setAuditId] = useState<number | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading || results) {
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isLoading, results]);

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     setIsLoading(true);
    //     setResults(null);
    //     setStepIndex(0);

    //     const interval = setInterval(() => {
    //         setStepIndex((i) => i + 1);
    //     }, 500);

    //     setTimeout(() => {
    //         clearInterval(interval);
    //         setResults({
    //             performance: Math.floor(80 + Math.random() * 20),
    //             seo: Math.floor(70 + Math.random() * 25),
    //             accessibility: Math.floor(75 + Math.random() * 20),
    //             bestPractices: Math.floor(70 + Math.random() * 25),
    //         });
    //         setIsLoading(false);
    //     }, 2000);
    // };

    // Polling pour récupérer les résultats réels
    useEffect(() => {
        if (!auditId) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/audits/${auditId}`);
                const data = await res.json();

                if (data.completed) {
                    setResults(data.results);
                    setIsLoading(false);
                    clearInterval(interval);
                }
            } catch (err) {
                console.error(err);
                clearInterval(interval);
                setIsLoading(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [auditId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setResults(null);
        setStepIndex(0);

        // Animation des étapes côté client
        const intervalSteps = setInterval(() => {
            setStepIndex((i) => {
                if (i < steps.length - 1) return i + 1;
                return i;
            });
        }, 500);

        try {
            // Création de l’audit côté serveur
            const response = await fetch("/api/audits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url,
                    performance: 0,
                    seo: 0,
                    accessibility: 0,
                    bestPractices: 0,
                    recommendations: [],
                }),
            });
            const data = await response.json();
            setAuditId(data.id);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
            clearInterval(intervalSteps);
        }
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center space-y-6">
            <Brand />

            {/* Hero */}
            <div className="max-w-3xl">
                <h1 className="text-5xl font-bold text-neutral-900 mb-4">
                    Analysez votre site en un clic
                </h1>
                <p className="text-neutral-700 mb-6">
                    Obtenez un audit complet SEO, performance et accessibilité
                    avec recommandations.
                </p>
            </div>

            {/* Formulaire URL */}
            <Card className="w-full max-w-xl">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-2"
                >
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://exemple.com"
                        required
                        className="flex-1 rounded-xl border border-neutral-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Audit en cours…" : "Lancer l’audit"}
                    </Button>
                </form>
            </Card>

            {/* Message de progression */}
            {isLoading && (
                <p className="text-sm text-neutral-600 animate-pulse mt-2">
                    {steps[Math.min(stepIndex, steps.length - 1)]}
                </p>
            )}

            {/* Point d’ancrage pour le scroll */}
            <div ref={resultRef} />

            {/* Skeleton pendant chargement */}
            {isLoading && <DashboardSkeleton />}

            {/* Résultats */}
            {results && <Dashboard results={results} />}

            {results && (
                <Card className="max-w-xl text-center space-y-2">
                    <p className="text-lg font-semibold">
                        {auditSummary(results)}
                    </p>
                    <Link to={`/report/1`}>
                        <Button className="transition transform hover:scale-105">
                            Voir le rapport détaillé
                        </Button>
                    </Link>
                </Card>
            )}
        </section>
    );
}
