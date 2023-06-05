import { useState } from "react";
import "./listCompany.css";
import { IoArrowForwardOutline, IoHomeOutline, IoLocationOutline } from "react-icons/io5";
import { useEffect } from "react";
import api from "../../services/api";
import { CounterPropertiesCompany } from "../CounterPropertiesCompany/CounterPropertiesCompany";

export function ListCompany() {

    const [company, setCompany] = useState([]);

    useEffect(() => {
        async function companyAll() {
            await api.get("/company/all").then((res) => {
                setCompany(res.data);
               
            }).catch((err) => {
                console.error(err);
            })
        }

        companyAll()
    },[]);

    const accountInativeds = company?.filter((companyUnic) => companyUnic.verified === false)
    const accountAtiveds = company?.filter((companyUnic) => companyUnic.verified === true)

    console.log(accountInativeds)
    console.log(accountAtiveds)


    return (
        <div className="ListCompany">
            <h5>Contas criadas: {company?.length} | Ativas: {accountAtiveds.length}  | Inativas: {accountInativeds.length} </h5>
            <input type="text" placeholder="Busque por nome, cidade ou estado" />
            <div className="companiesList">
                { company?.map((companies) => {
                        return (
                             
                    <div className="unicCompany" key={companies.id}>
                            <div className="image">
                                <a href={`/imobiliaria/${companies.nameSlug}`}>
                                 <img src={companies.logo} alt="" />
                                </a>
                            </div>
                            <div className="text">
                            <a href={`/imobiliaria/${companies.nameSlug}`}>
                            <h4>{companies.fantasyName}</h4>
                            </a>
                            <h6><IoLocationOutline /> {companies.city} - {companies.uf} | {companies.verified === true ? "Ativo" : "Inativo"}</h6>

                            <h6><IoHomeOutline /><CounterPropertiesCompany id={companies.id}/> Anúncios</h6>
                            {/* <a className="LinkCompany" href={`/imobiliaria/${companies.nameSlug}`}>
                            <IoArrowForwardOutline /> Ver empresa
                            </a> */}
                            </div>
                        </div> 
                        )
                    })}
            </div>
        </div>
    )
}