import { useState } from "react";
import "./listProperty.css";
import { IoArrowForwardOutline, IoHomeOutline, IoLocationOutline } from "react-icons/io5";
import { useEffect } from "react";
import api from "../../services/api";

export function ListProperty() {

    const [property, setProperty] = useState([]);

    useEffect(() => {
        async function propertyAll() {
            await api.get("/property/lists/propertiesAll").then((res) => {
                setProperty(res.data);
                console.log("res.data");
                console.log(res.data);
            }).catch((err) => {
                console.error(err);
            })
        }

        propertyAll()
    },[]);

    const propertyDisponivel = property?.filter((propertyUnic) => propertyUnic.availability === "Disponível")
    const propertyIndisponivel = property?.filter((propertyUnic) => propertyUnic.availability === "Indisponível")
    const propertyAlugado = property?.filter((propertyUnic) => propertyUnic.availability === "Alugado")
    const propertyVendido = property?.filter((propertyUnic) => propertyUnic.availability === "Vendido")
    const propertyReservado = property?.filter((propertyUnic) => propertyUnic.availability === "Reservado")



    return (
        <div className="ListProperty">
            <h5>Disponível: {propertyDisponivel.length} | Indisponível: {propertyIndisponivel.length} | 
            Alugados: {propertyAlugado?.length} | Vendidos: {propertyVendido.length}</h5>
            <input type="text" placeholder="Busque por nome, cidade ou estado" />
            <div className="propertiesList">
                { property?.map((properties) => {
                        return (
                             
                    <div className="unicProperty" key={properties.id}>
                            <div className="image">
                                <a href={`/imobiliaria/${properties.id}`}>
                                 <img src={properties.featuredImage} alt="" />
                                </a>
                            </div>
                            <div className="text">
                            <a href={`/imovel/${properties.id}`}>
                            <h5>{properties.type} {properties.SubType} - {properties.status}</h5>
                            </a>
                            <h6><IoHomeOutline /> {properties.title}</h6>
                            <h6><IoLocationOutline /> {properties.city} - {properties.uf} | {properties.availability}</h6>
                            </div>
                        </div> 
                        )
                    })}
            </div>
        </div>
    )
}