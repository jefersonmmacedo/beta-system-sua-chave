import {Route, Routes, Navigate} from 'react-router-dom';
import { Pricing } from '../pages/Pricing/Pricing';
import { SignInCompany } from '../pages/SignInCompany/SignInCompany';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { NewProperty } from '../pages/NewProperty/NewProperty';
import { PlainsAdm } from '../pages/PlainsAdm/PlainsAdm';
import { NotificationsAdm } from '../pages/NotificationsAdm/NotificationsAdm';
import { EquipeAdm } from '../pages/EquipeAdm/EquipeAdm';
import { MyAccountAdm } from '../pages/MyAccountAdm/MyAccountAdm';
import { MenuAdm } from '../pages/MenuAdm/MenuAdm';
import { SchedulingAdm } from '../pages/SchedulingAdm/SchedulingAdm';
import { Checkout } from '../pages/Checkout/Checkout';
import { PaymentCompleted } from '../pages/PaymentCompleted/PaymentCompleted';
import { MyPropertiesList } from '../pages/MyPropertiesList/MyPropertiesList';
import { EditProperty } from '../pages/EditProperty/EditProperty';
import { ChatAdmList } from '../pages/ChatAdmList/ChatAdmList';
import { MyAppointments } from '../pages/MyAppointments/MyAppointments';
import { MyRents } from '../pages/MyRents/MyRents';
import { MySales } from '../pages/MySales/MySales';
import { MyAssessments } from '../pages/MyAssessments/MyAssessments';
import { FinancerAdm } from '../pages/FinancerAdm/FinancerAdm';
import { AccessAdm } from '../pages/AccessAdm/AccessAdm';
import { SupportAdm } from '../pages/SupportAdm/SupportAdm';
import { MyClientsList } from '../pages/MyClientsList/MyClientsList';
import { WebApp } from '../pages/WebApp/WebApp';
import { MyLeads } from '../pages/MyLeads/MyLeads';
import { ChatMessage } from '../pages/ChatMessage/ChatMessage';
import { SignUpProfessional } from '../pages/SignUpProfessional/SignUpProfessional';
import { MyContracts } from '../pages/MyContracts/MyContracts';
import { LocadorAdm } from '../pages/LocadorAdm/LocadorAdm';
import { MyChargesProperty } from '../pages/MyChargesProperty/MyChargesProperty';
import { PrintInfosFinancer } from '../pages/PrintInfosFinancer/PrintInfosFinancer';
import { ChooseYourAccount } from '../pages/ChooseYourAccount/ChooseYourAccount';
import { SignUpBroker } from '../pages/SignUpBroker/SignUpBroker';
import { ConfirmedAccount } from '../pages/ConfirmedAccount/ConfirmedAccount';
import { MyMatch } from '../pages/MyMatch/MyMatch';
import { RecuperationCode } from '../pages/RecuperartionCode/RecuperartionCode';
import { Recuperation } from '../pages/Recuperation/Recuperation';
import { RecuperationPassword } from '../pages/RecuperartionPassword/RecuperartionPassword';
import { MyGuarantor } from '../pages/MyGuarantor/MyGuarantor';
import { useContext } from 'react';
import { AuthContext } from '../contexts/Auth';
import { NewContract } from '../pages/NewContract/NewContract';
import { Partners } from '../pages/Partners/Partners';
import { TestingPeriodFinal } from '../pages/TestingPeriod/TestingPeriodFinal/TestingPeriodFinal';
import { TestingPeriodInitial } from '../pages/TestingPeriod/TestingPeriodInitial/TestingPeriodInitial';
import { CancelAccount } from '../pages/TestingPeriod/CancelAccount/CancelAccount';
import { PaymentNotFound } from '../pages/TestingPeriod/PaymentNotFound/PaymentNotFound';
import { NewProposal } from '../pages/NewProposal/NewProposal';
import { MyProposals } from '../pages/MyProposals/MyProposals';
import { SchedulingConfig } from '../pages/SchedulingConfig/SchedulingConfig';
import { NewChargeProperty } from '../pages/NewChargeProperty/NewChargeProperty';
import { InspectionProperty } from '../pages/InspectionProperty/InspectionProperty';
import { UpdatesSystem } from '../pages/UpdatesSystem/UpdatesSystem';
import { UpgradePlain } from '../pages/UpgradePlain/UpgradePlain';
import { Home2 } from '../model/pages/Home2/Home2';
import { Home3 } from '../model/pages/Home3/Home3';
import { EditContract } from '../pages/EditContract/EditContract';
import { NewRegisterSale } from '../pages/NewRegisterSale/NewRegisterSale';
import { MyRegisterSales } from '../pages/MyRegisterSales/MyRegisterSales';



function Router () {
const {logout} = useContext(AuthContext);

const Local = localStorage.getItem("adm-suachave");
const userLocal = JSON.parse(Local)
const LocalClient = localStorage.getItem("suachave");
const userLocalClient = JSON.parse(LocalClient)

if(userLocalClient !== null) {
        localStorage.removeItem("suachave");
}

function PrivateRoute({children} ) {
    return userLocal !== null || userLocal?.type === "client" ? children : <Navigate to="/"/>
}

    return (
            <Routes>
            <Route path="/" element={<SignInCompany />}/>
            <Route path="/novoplano" element={<Pricing />}/>
            <Route path="/cadastrar/:iduser" element={<ChooseYourAccount />}/>
            <Route path="/cadastro" element={<SignUpProfessional />}/>
            <Route path="/cadastro/:id" element={<SignUpProfessional />}/>
            <Route path="/cadastro-corretor" element={<SignUpBroker />}/>
            <Route path="/confirmacao" element={<ConfirmedAccount />}/>
            <Route path="/recuperar" element={<Recuperation />}/>
            <Route path="/recuperar-codigo/:email" element={<RecuperationCode />}/>
            <Route path="/recuperar-nova-senha/:email" element={<RecuperationPassword />}/>

            <Route path="/home"
                    element={ <PrivateRoute> <Dashboard /> </PrivateRoute>} />
            <Route path="/meusite"
                    element={ <PrivateRoute> <Home2 /> </PrivateRoute>} />
            <Route path="/meusite/model2"
                    element={ <PrivateRoute> <Home3 /> </PrivateRoute>} />
            <Route path="/periodo-teste"
                    element={ <PrivateRoute> <TestingPeriodInitial /> </PrivateRoute>} />
            <Route path="/fim-periodo-teste"
                    element={ <PrivateRoute> <TestingPeriodFinal /> </PrivateRoute>} />
            <Route path="/cancelar-conta"
                    element={ <PrivateRoute> <CancelAccount /> </PrivateRoute>} />
            <Route path="/atualizar-plano/:plainName"
                    element={ <PrivateRoute> <UpgradePlain /> </PrivateRoute>} />
            <Route path="/pagamento-pendente"
                    element={ <PrivateRoute> <PaymentNotFound /> </PrivateRoute>} />
            <Route path="/novoimovel"
                    element={ <PrivateRoute> <NewProperty /> </PrivateRoute>} />
            <Route path="/editarimovel/:id"
                    element={ <PrivateRoute> <EditProperty /> </PrivateRoute>} />
            <Route path="/imoveis"
                    element={ <PrivateRoute> <MyPropertiesList /> </PrivateRoute>} />
            <Route path="/plano/:id"
                    element={ <PrivateRoute> <Checkout /> </PrivateRoute>} />
            <Route path="/meus-planos"
                    element={ <PrivateRoute> <PlainsAdm /> </PrivateRoute>} />
            <Route path="/novoplano"
                    element={ <PrivateRoute> <Pricing /> </PrivateRoute>} />
            <Route path="/pagamentofinalizado"
                    element={ <PrivateRoute> <PaymentCompleted /> </PrivateRoute>} />
            <Route path="/mensagens"
                    element={ <PrivateRoute> <ChatAdmList /> </PrivateRoute>} />
            <Route path="/chat/:room/:idProperty/:idCompany/:idClient"
                    element={ <PrivateRoute> <ChatMessage /> </PrivateRoute>} />
            <Route path="/notificacoes"
                    element={ <PrivateRoute> <NotificationsAdm /> </PrivateRoute>} />
            <Route path="/agendamentos"
                    element={ <PrivateRoute> <MyAppointments /> </PrivateRoute>} />
           <Route path="/agendamento/:id"
                   element={ <PrivateRoute> <SchedulingAdm /> </PrivateRoute>} />
           <Route path="/configurar-agendamento"
                   element={ <PrivateRoute> <SchedulingConfig /> </PrivateRoute>} />
           <Route path="/contratos"
                   element={ <PrivateRoute> <MyContracts /> </PrivateRoute>} />
           <Route path="/propostas"
                   element={ <PrivateRoute> <MyProposals /> </PrivateRoute>} />
           <Route path="/vendas"
                   element={ <PrivateRoute> <MyRegisterSales /> </PrivateRoute>} />
           <Route path="/novo-contrato"
                   element={ <PrivateRoute> <NewContract /> </PrivateRoute>} />
           <Route path="/editar-contrato/:id"
                   element={ <PrivateRoute> <EditContract /> </PrivateRoute>} />
           <Route path="/nova-proposta"
                   element={ <PrivateRoute> <NewProposal /> </PrivateRoute>} />
           <Route path="/nova-venda"
                   element={ <PrivateRoute> <NewRegisterSale /> </PrivateRoute>} />
           <Route path="/avaliacoes"
                   element={ <PrivateRoute> <MyAssessments /> </PrivateRoute>} />
           <Route path="/integracoes"
                   element={ <PrivateRoute> <Partners /> </PrivateRoute>} />
            <Route path="/equipe"
                    element={ <PrivateRoute> <EquipeAdm /> </PrivateRoute>} />
            <Route path="/proprietarios"
                    element={ <PrivateRoute> <LocadorAdm /> </PrivateRoute>} />
            <Route path="/fiadores"
                    element={ <PrivateRoute> <MyGuarantor /> </PrivateRoute>} />
            <Route path="/minhaconta"
                    element={ <PrivateRoute> <MyAccountAdm /> </PrivateRoute>} />
            <Route path="/match"
                    element={ <PrivateRoute> <MyMatch /> </PrivateRoute>} />
            <Route path="/meu-site"
                    element={ <PrivateRoute> <WebApp /> </PrivateRoute>} />
            <Route path="/financeiro"
                    element={ <PrivateRoute> <FinancerAdm /> </PrivateRoute>} />
            <Route path="/historico"
                    element={ <PrivateRoute> <AccessAdm /> </PrivateRoute>} />
            <Route path="/suporte"
                    element={ <PrivateRoute> <SupportAdm /> </PrivateRoute>} />
            <Route path="/menu"
                    element={ <PrivateRoute> <MenuAdm /> </PrivateRoute>} />
            <Route path="/clientes"
                    element={ <PrivateRoute> <MyClientsList /> </PrivateRoute>} />
            <Route path="/encargos"
                    element={ <PrivateRoute> <MyChargesProperty /> </PrivateRoute>} />
            <Route path="/novo-encargo"
                    element={ <PrivateRoute> <NewChargeProperty /> </PrivateRoute>} />
            <Route path="/imprimir/:type"
                    element={ <PrivateRoute> <PrintInfosFinancer /> </PrivateRoute>} />
            <Route path="/leads"
                    element={ <PrivateRoute> <MyLeads /> </PrivateRoute>} />
            <Route path="/vistorias"
                    element={ <PrivateRoute> <InspectionProperty /> </PrivateRoute>} />
            <Route path="/nova-vistoria"
                    element={ <PrivateRoute> <InspectionProperty /> </PrivateRoute>} />
            <Route path="/atualizacoes"
                    element={ <PrivateRoute> <UpdatesSystem /> </PrivateRoute>} />

            </Routes>
           
    )
}

export {Router}