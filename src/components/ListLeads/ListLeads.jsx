import { useState } from "react";
import "./listLeads.css";
import { IoArrowForwardOutline, IoBusinessOutline, IoHomeOutline, IoLocationOutline, IoLogoWhatsapp, IoMailOutline } from "react-icons/io5";
import { useEffect } from "react";
import api from "../../services/api";
import { DateFormat2 } from "../DateFormat2/DateFormat2";

export function ListLeads() {

    const [lead, setLead] = useState([]);

    useEffect(() => {
        async function leadsAll() {
            await api.get("/contact/leads/all").then((res) => {
                setLead(res.data);
                console.log("res.data");
                console.log(res.data);
            }).catch((err) => {
                console.error(err);
            })
        }

        leadsAll()
    },[]);


    return (
        <div className="ListLeads">
            <h5>Total de leads: {lead?.length} </h5>
            <input type="text" placeholder="Busque por nome, cidade ou estado" />
            <div className="leadsList">
                { lead?.map((leads) => {
                        return (
                             
                    <div className="unicLead" key={leads.id}>
                            <div className="image">
                                <a href={`#`}>
                                 <img src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="" />
                                </a>
                            </div>
                            <div className="text">
                            <a href={`#`}>
                            <h5>{leads?.name} - <DateFormat2 date={leads?.created_at}/></h5>
                            </a>
                            <h6><IoBusinessOutline /> {leads?.nameCompany} | <IoHomeOutline /> {leads.idProperty}</h6>
                            <h6><IoMailOutline /> {leads?.email} | <IoLogoWhatsapp /> {leads?.whatsapp}</h6>
                            </div>
                        </div> 
                        )
                    })}
            </div>
        </div>
    )
}