import { DownloadApp } from "../../components/DownloadApp/DownloadApp"
import NavbarAdm from "../../components/Nav/Navbar"
import { ToolBar } from "../../components/ToolBar/ToolBar"
import "./dashboard.css";
import {IoHomeOutline, IoCalendarOutline, IoLogoWhatsapp, IoCallOutline,IoAlertCircle,
    IoHeartOutline, IoKeyOutline, IoRocketOutline, IoSearchOutline} from 'react-icons/io5'
import { PropertiesCount } from "../../components/ItensDashboard/PropertiesCount";
import { PropertiesCountSale } from "../../components/ItensDashboard/PropertiesCountSale";
import { PropertiesCountRent } from "../../components/ItensDashboard/PropertiesCountRent";
import { EvaluationCount } from "../../components/ItensDashboard/EvaluationCount";
import { SchedulingCount } from "../../components/ItensDashboard/SchedulingCount";
import { ContactWhatsappCount } from "../../components/ItensDashboard/ContactWhatsappCount";
import { ContactPhoneCount } from "../../components/ItensDashboard/ContactPhoneCount";
import { FavoriteCount } from "../../components/ItensDashboard/FavoriteCount";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { PropertiesCountAvailability } from "../../components/ItensDashboard/PropertiesCountAvailability";
import { ContactLeadCount } from "../../components/ItensDashboard/ContactLeadCount";
import { SchedulingAllCompleted } from "../../components/ItensDashboard/SchedulingAllCompleted";
import { SchedulingAll } from "../../components/ItensDashboard/SchedulingAll";
import { PropertiesCountRentSale } from "../../components/ItensDashboard/PropertiesCountRentSale";
import { ProposalsCounter } from "../../components/ItensDashboard/ProposalsCounter";
import { Commissions } from "../../components/ItensDashboard/Commissions";
import { SalesProperties } from "../../components/ItensDashboard/SalesProperties";
import { RentProperties } from "../../components/ItensDashboard/RentProperties";
import { TotalRevenue } from "../../components/ItensDashboard/TotalRevenue";
import { ListCompany } from "../../components/ListCompany/ListCompany";
import { ListProperty } from "../../components/ListProperty/ListProperty";
import { ListLeads } from "../../components/ListLeads/ListLeads";



export function Dashboard() {

    const Local = localStorage.getItem("adm-suachave");
    const user = JSON.parse(Local);

    const [myPayments, setMyPayments] = useState([])
    const [myPlain, setMyPlain] = useState([])
    const [phone, setPhone] = useState()

    const [days, setDays] = useState()




    return (
        <div className="Dashboard">
            <NavbarAdm />
            <ToolBar />
            <div className="aside">
                <div className="textHome">
                <h3>Olá, {user.fantasyName}.</h3>
                <h5>Última atualização: 02/05/2023. <a href="/atualizacoes">Veja as atualizações</a></h5>
                </div>


                <div className="topInfomations">
                    <div className="properties">
                        <ListCompany />
                    </div>

                    <div className="properties">
                        <ListProperty />
                    </div>

                    <div className="properties">
                        <ListLeads />
                    </div>
                </div>

                <div className="Whatsapp">
                    <h4>Adicione o número e clique no botão do whatsapp</h4>
                    <div className="inputButton">
                    <input type="text"  placeholder="(XX)XXXXX-XXXX" value={phone} onChange={e => setPhone(e.target.value)}/>
                    <a href={`https://api.whatsapp.com/send?phone=55${phone}`} className="linkWhatsapp" target="_blank" rel="noopener noreferrer">
                        <IoLogoWhatsapp size={16}/></a>
                    </div>
                </div>


            {/* <DownloadApp /> */}
            </div>
        </div>
    )
}