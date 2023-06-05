import { useFetch } from "../../hooks/useFetch";

export function CounterPropertiesCompany({id}) {
    const {data} = useFetch(`/property/company/${id}`);

    return (
        <>
        { data?.length}
        </>
    )
}