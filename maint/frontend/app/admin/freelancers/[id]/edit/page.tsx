// page.tsx (server)

import EditFreelancerClient from "./EditFreelancerClient";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditFreelancerClient freelancerId={id} />;
}
