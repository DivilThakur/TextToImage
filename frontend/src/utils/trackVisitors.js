export const trackVisitor = async () => {

    if (localStorage.getItem("visitor_tracked")) return;

    let visitorId = localStorage.getItem("visitor_id");

    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("visitor_id", visitorId);
    }

    try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/visitor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visitorId }),
        });

        localStorage.setItem("visitor_tracked", "true");
    } catch (err) {
        console.warn("Visitor tracking failed");
    }
};
