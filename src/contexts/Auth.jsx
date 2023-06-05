import {createContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import api from '../services/api';
import apiMail from '../services/apiMail';


const AuthContext = createContext({});

function AuthProvider({children}) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [comentsPosts, setComentsPosts] = useState([])
    const [listPrint, setListPrint] = useState([])

    function handleListPrint(data) {
;
        setListPrint(data)
    }

    async function createAccountSquad({
        avatar, name, nameSlug, fantasyName, rg, cpf_Cnpj, profession, birthday, numberRegister, register, email, phone, whatsapp, cep, road, number,
        district, city, uf, password,
        }) {
        const data = {
            avatar, name, nameSlug, fantasyName, rg, cpf_Cnpj, profession, birthday, numberRegister, register, email, phone, whatsapp, cep, road, number,
            district, city, uf, password,
            }

        
        await api.post('/squad', data).then(() => {
          //  completeAccount(email)
            toast.info(`Cadastro criado com sucesso!`);
            mailcreateAccount({email, name: fantasyName})

            window.open(`/confirmacao`, "_self")


        }).catch(error => {
            console.log("Cadastro não foi realizado: "+ error);
            toast.error(`Username ou E-mail ja utilizados. Tente outro por favor!`);
        });
    }

    async function mailcreateAccount({email, name}) {
        const data = {email, name}
        await api.post("/mail/create", data);
    }


    async function updateAccountCompany({
        id, type, verified, status, cpf_Cnpj ,nameSlug, socialReason, fantasyName, creci, email, phone, whatsapp, responsibleName,
        emailResponsible, whatsappResponsible, logo, cep, road, number, district, city, uf, website, facebook, instagram, linkedin, youtube,
        date
        }) {
        const data = {
            type, verified, status, cpf_Cnpj ,nameSlug, socialReason, fantasyName, creci, email, phone, whatsapp, responsibleName,
            emailResponsible, whatsappResponsible, logo, cep, road, number, district, city, uf, website, facebook, instagram, linkedin, youtube
            }
        const data2 = {
            id, type, verified, status, cpf_Cnpj ,nameSlug, socialReason, fantasyName, creci, email, phone, whatsapp, responsibleName,
            emailResponsible, whatsappResponsible, logo, cep, road, number, district, city, uf, website, facebook, instagram, linkedin, youtube,
            date
            }
        
        await api.patch(`/squad/updateAccount/${id}`, data).then(() => {
            toast.info(`Cadastro atualizado com sucesso!`);
            mailUpdateAccount({email, name: fantasyName})
            localStorage.setItem("adm-suachave", JSON.stringify(data2));

            window.open(`/minhaconta`, "_self")


        }).catch(error => {
            console.log("Cadastro não foi atualizado: "+ error);
            toast.error(`Falha na atualização do cadastro!`);
        });
    }

    async function mailUpdateAccount({email, name}) {
        const data = {email, name}
        await api.post("/mail/updateAccount", data);
    }



    async function loginSessionSquad({email, password, device, browser, latitude, longitude, ipDevice}) {     

            await api.post("/session/squad", {email, password}).then((result) => {
                if(result.data.status === "blocked") {
                    toast.error(`Olá, ${result.data.fantasyName}. Precisamos confirmar alguns dados de sua conta. Um de nossos colaboradores entrará em contato!`);
                    return
                }

                console.log(result.data)
                localStorage.setItem("adm-suachave", JSON.stringify(result.data));
               newAccess({idCompany: result.data.id, idTeam: "", device, browser, latitude, longitude, ipDevice});

               window.open("/home", "_self")

                
                toast.success(`Entrando...`);
            }).catch(error => {
                console.log("Login não foi realizado" + error);
                setLoading(false);
            })        
    }  


    async function loginAndUpdatePassword({email, password, passwordNew}) {
        console.log(email, password) 
            await api.post("/session/company", {email, password}).then((result) => {
                recoverPasswordNew(email, passwordNew)
            }).catch(error => {
                toast.info("Falha! Senha atual está incorreta.");
                console.log("Login não foi realizado" + error);
                setLoading(false);
            })        
    }  

    async function gerateCodeRecuperation(email, code) {
        console.log(email)
        const account =  await api.get(`/squad/unicEmail/${email}`);
        console.log(account)
        
        if(account.data.length === 0) {
            toast.error("Não existe conta com este e-mail em nossa base de dados!")
            return
        } 
        
        await api.post("/recuperation", {email, code}).then((res) => {
            console.log(res.data);
            codeRecuperation(email, code);
        }).catch((error) => {
            console.log(error)
        })
    }

    
    async function codeRecuperation(email, code) {
        console.log(email, code)
        const res = await apiMail.post("/mail/passwordcode", {mail: email, code: code});
        if(res.status === 200) {
            window.open(`/recuperar-codigo/${email}`,"_self")
        }
    }



    async function validadeCodeRecuperation(code, email) {
        console.log(code, email)
       const codeRecuperationData =  await api.get(`/recuperation/find/${email}/${code}`);
       console.log(codeRecuperationData)
    
       if(codeRecuperationData.data.length === 0) {
           toast.error("Código inválido ou expirado!")
           return
       } 
    
       window.open(`/recuperar-nova-senha/${email}`,"_self")
    }

    
    async function recoverPasswordNew(email, password) {
        console.log(email, password)
        await api.patch(`squad/update/${email}`, {password}).then(() => {
            toast.info("Senha atualizada com sucesso");
            passwordRecoverOk(email)
           
        }).catch((error) => {
            toast.error("Erro ao atualiza senha");
            console.log(error)
        })
    }
    
    async function passwordRecoverOk(email) {
        const res = await api.post("/mail/newpassword", {mail: email});
        if(res.status === 200) {
            window.open(`/`,"_self")
        }
    }
    

    async function newAccess({idCompany, idTeam, device, browser, latitude, longitude, ipDevice}) {
        const data = {idCompany, idTeam, device, browser, latitude, longitude, ipDevice}
        await api.post("/acess", data).then((res) => {
            window.open("/home", "_self")
        }).catch(error => {
            console.log(error);
        })
    }
    

    // Fim da Sessão grupos
    async function logout() {
        localStorage.removeItem("adm-suachave");
        window.open("/", "_self");
    }

    //payments
    async function createPayment({id, idPlain, idCompany, email, namePlain, value, period, linvoice_link, aceptTerms, status, status2, maturity, users, emphasis, nameCompany}) {
        const data = {idPlain, idCompany, status: status2, namePlain, value, maturity, users, emphasis}

        const res = await api.get(`/myplain/${idCompany}`);

        if(res.data[0]?.idPlain !== idPlain) {
           
                await api.post("/myplain/", data).then((res) => {
                    toast.success("Novo plano criado com sucesso")
                   handleNewPayment({id, idPlain, idCompany, email, namePlain, value, period, linvoice_link, aceptTerms, status})
                   mailPayment(nameCompany, namePlain, value)
                }).catch((error) => {
                    console.log(error)
                })

        } else {
           handleNewPayment({id, idPlain, idCompany, email, namePlain, value, period, linvoice_link, aceptTerms, status})
           mailPayment(nameCompany, namePlain, value)
        }

    }

    async function mailPayment(nameCompany, namePlain, value) {
        const data = {
            nameClient:nameCompany,
            plain:namePlain,
            value:value,
        }

        await apiMail.post("/mail/newPayment", data).then((res) => {
            console.log("E-mail enviado");
        }).catch((error) => {
            console.log(error)
        });
    }

    async function handleNewPayment({id, idPlain, idCompany, email, namePlain, value, period, linvoice_link, aceptTerms, status}) {
        const data = {id, idPlain, idCompany, email, namePlain, value, period, linvoice_link, aceptTerms, status}
        console.log({id, idPlain, idCompany, email, namePlain, value, period, linvoice_link, aceptTerms, status})
        toast.success("Iniciando pagamento");

        await api.post("/payments/", data).then((res) => {
            toast.success("Pagamento efetuado com sucesso");

            console.log(res.data.invoice_link)
            if(res.invoice_link !== "" || res.invoice_link !== null || res.invoice_link !== undefined) {
                window.open(`${res.data.invoice_link}`)
            }
            setTimeout(() => {
                window.open(`/pagamentofinalizado/`, "_self")
              }, "5000")
        
        }).catch((error) => {
            console.log(error)
        })
    }
    
    async function newFinancer({idCompany, idTransaction, idLocator, nameLocator, idProperty, nameProperty, title, description, type, value, document}) {
        const data = {idCompany, idTransaction, idLocator, nameLocator, idProperty, nameProperty, title, description, type, value, document};


        await api.post("/financer/", data).then((res) => {
            toast.success("Cadastro realizado");

            setTimeout(() => {
                window.open("/financeiro", "_self")
              }, "1000")
        }).catch((error) => {
            console.log(error)  
        })
}
    async function editFinancer({idCompany, idTransaction, idLocator, nameLocator, idProperty, nameProperty, title, description, type, value, document}) {
        const data = {idCompany, idTransaction, idLocator, nameLocator, idProperty, nameProperty, title, description, type, value, document};


        await api.post("/financer/", data).then((res) => {
            toast.success("Cadastro realizado");

            setTimeout(() => {
                window.open("/financeiro", "_self")
              }, "1000")
        }).catch((error) => {
            console.log(error)  
        })
}

async function newClientCompany({idProcess, idCompany, typeClient, name, fantasyName, rg, cpf_Cnpj, email, phone, whatsapp, avatar, road,
    number, district, city, uf, interest, type, subtype, cityPreference, ufPreference, attendance}) {
            const data = {idProcess,idCompany, typeClient, name, fantasyName, rg, cpf_Cnpj, email, phone, whatsapp, avatar, road,
                number, district, city, uf, interest, type, subtype, cityPreference, ufPreference, attendance}

        

                await api.post("/clientCompany", data).then((res) => {
                    window.open("/clientes", "_self")
                }).catch(err => {
                    console.log(err)
                });
    }
async function updateClientCompany({id, idProcess, typeClient, name, fantasyName, rg, cpf_Cnpj, email, phone, whatsapp, avatar, road,
    number, district, city, uf, interest, type, subtype, cityPreference, ufPreference, attendance}) {
            const data = {idProcess,typeClient, name, fantasyName, rg, cpf_Cnpj, email, phone, whatsapp, avatar, road,
                number, district, city, uf, interest, type, subtype, cityPreference, ufPreference, attendance}

        

                await api.patch(`/clientCompany/${id}`, data).then((res) => {
                    window.open("/clientes", "_self")
                }).catch(err => {
                    console.log(err)
                });
    }

async function deleteClientCompany({id}) {
                await api.delete(`/clientCompany/${id}`).then((res) => {
                    window.open("/clientes", "_self")
                }).catch(err => {
                    console.log(err)
                });
    }
async function deletePropertyCompany({id}) {
                await api.delete(`/property/${id}`).then((res) => {
                    window.open("/imoveis", "_self")
                }).catch(err => {
                    console.log(err)
                });
    }



async function newCollaborator({idCompany, avatar, profession, name, schooling, rg, cpf_Cnpj, birthday, register,
    email, phone, whatsapp, road, number, district, city, uf,
    instagram, facebook, linkedin, twitter,
    bank, agency, typeAccount, account, typeKeyPix, keypix,}) {
            const data = {idCompany, avatar, profession, name, schooling, rg, cpf_Cnpj, birthday, register,
                email, phone, whatsapp, road, number, district, city, uf,
                instagram, facebook, linkedin, twitter,
                bank, agency, typeAccount, account, typeKeyPix, keypix,}

        

                await api.post("/team", data).then((res) => {
                    window.open("/funcionarios", "_self")
                }).catch(err => {
                    console.log(err)
                });
    }

    async function newLocador({idCompany, name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}) {
        const data = {idCompany, name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}

        await api.post("/locator", data).then((res) => {
            window.open("/proprietarios", "_self")
        }).catch(err => {
            console.log(err);
            toast.error("Erro ao criar locador")
        });
    }
    async function updateLocador({id, name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}) {
        const data = {name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}

        await api.patch(`/locator/${id}`, data).then((res) => {
            window.open("/proprietarios", "_self")
        }).catch(err => {
            console.log(err);
            toast.error("Erro ao atualizar locador")
        });
    }
    async function deleteLocatorCompany({id}) {
      
        await api.delete(`/locator/${id}`).then((res) => {
            window.open("/proprietarios", "_self")
        }).catch(err => {
            console.log(err);
            toast.error("Erro ao deletar locador")
        });
    }

    async function newGuarantor({idCompany, name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}) {
        const data = {idCompany, name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}

        await api.post("/guarantorCompany", data).then((res) => {
            window.open("/fiadores", "_self")
        }).catch(err => {
            console.log(err);
            toast.error("E-mail ja utilizado em outro locador")
        });
    }
    async function updateGuarantor({id, name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}) {
        const data = { name, fantasyName, rg, cpf_Cnpj, birthday, email, phone, whatsapp, cep, road, number, district, city, uf}

        await api.patch(`/guarantorCompany/${id}`, data).then((res) => {
            window.open("/fiadores", "_self")
        }).catch(err => {
            console.log(err);
            toast.error("Erro ao criar locador")
        });
    }
    async function deleteGuarantorCompany({id}) {

        await api.delete(`/guarantorCompany/${id}`).then((res) => {
            window.open("/fiadores", "_self")
        }).catch(err => {
            console.log(err);
            toast.error("Erro ao deletar locador")
        });
    }
    async function deleteContractCompany({id}) {

        await api.delete(`/contracts/${id}`).then((res) => {
            window.open("/contratos", "_self")
        }).catch(err => {
            console.log(err);
            toast.error("Erro ao deletar contrato")
        });
    }

    async function mewNegociation({ idCompany, nameCompany ,idTeam, idClient, nameClient, emailClient,cpfClient, idProperty, titleProperty, typeNegotiation, status, deadline,
        parcel, valueProperty, amountofCharges, valueTotal, typeOfInsurance }) {

            console.log({ idCompany, nameCompany ,idTeam, idClient, nameClient, emailClient,cpfClient, idProperty, titleProperty, typeNegotiation, status, deadline,
                parcel, valueProperty, amountofCharges, valueTotal, typeOfInsurance });

                const data = ({idCompany, idTeam, idClient, nameClient, cpfClient, idProperty, typeNegotiation, status, deadline,
                    parcel, valueProperty, amountofCharges, valueTotal, typeOfInsurance})

                    await api.post("/negotiations", data).then((res) => {
                        mailProcess({email: emailClient, name: nameClient, company: nameCompany,  status: typeNegotiation,
                            website: "http://suachave.com.br/imovel/", title: titleProperty, idProperty})
                    }).catch(err => {
                        console.log(err)
                    });
            } 

            async function mailProcess({email, name, company,  status, website, title, idProperty}) {
                const dataProcess = {email, name, company,  status, website, title, idProperty}
                await api.post("/mail/newContract", dataProcess).then((res) => {
                    window.open("/contratos", "_self")
                }).catch((err) => {})
            }


    async function updateAccount({id, avatar, cover, city, uf, relationship, nickname, cep, latitude, longitude, país, username, role, status, type, email, phone, online, patron}){
        const Local = localStorage.getItem("adm-suachave");
        const user = JSON.parse(Local)
        const Local2 = localStorage.getItem("informations-suachave");
        const userInformations = JSON.parse(Local2)
        const data = {avatar, cover, city, uf, relationship, nickname, cep, latitude, longitude, país, username, role, status, type, email, phone, online, patron};
        const data2 = {avatar, cover, city, uf, relationship, nickname, cep, latitude, longitude, país, username, role, status, type, email, phone, online, patron, date:user.date , token:user.token  , expiresIn:user.expiresIn };
        console.log(id)

        await api.patch(`/accounts/${id}`, data).then(res => {
            localStorage.setItem("adm-suachave", JSON.stringify(data2));
            window.open("/feed", "_self")
        }).catch(error => {
            console.log(error)
        });
    }


async function deleteAccount(id) {
    toast.success("Deletando sua conta")
    const Local = localStorage.getItem("informations-suachave");
    const user = JSON.parse(Local);
     toast.success("Deletando conta de usuário")
    console.log("Deletando conta de usuário")

    const res = await api.delete(`/accounts/${id}`);

    if(res.status===201) {
        toast.info("Deletando informações") 
       
        const idPatrono = user.patron;
        const text = `${user.username}, Deletou sua conta em nosso site`;
        const type = "notification";
        const idPost = "";
        const idFriend = "";
        const idAccount = user.id;
        notifications(idPatrono, text, idAccount, idFriend, type, idPost)
       
     } else {
        toast.error('Falha ao deletar, tente novamente!');
     }
}

async function deleteConversations(user) {
    const idAccount = user.id
    const rmyRooms1 = await api.get(`conversations/account/filter/${idAccount}`)

     const idFriend = user.id
     const rmyRooms2 = await api.get(`conversations/friend/filter/${idFriend}`)

     const newRooms = rmyRooms1.data.concat(rmyRooms2.data);
     // console.log(newRooms);

     newRooms.forEach(async (room) => {
         const id = room.id
         toast.success("Deletado conversas!");
              await api.delete(`/conversations/${id}`);
     })
     toast.success("Deletado com sucesso!");
}

async function deleteConversation(room) {
    await api.delete(`/conversations/room/${room}`).then((res) => {
        toast.success("Deletado com sucesso!");
        window.open("/messages", "_self")

    })
}

async function recuperationUserForEmail(email) {
    console.log(email)
   const account =  await api.get(`/squad/unicEmail/${email}`);
   console.log(account)

   if(account.data.length === 0) {
       toast.error("Não existe conta com este e-mail em nossa base de dados!")
       return
   } 

   const username = account.data[0].username
   //searchUsername(email, username)
}


//Novo ontrato
async function updateContract({
    id, idProperty,title, idCompany, idLocator, nameLocator, cpfCnpjLocator, idClient, nameClient, cpfCnpjClient, idGuarantor,
    nameGuarantor, cpfCnpjGuarantor, type, subType, assurance, securityDeposit, typeNegotiation, newContract, status,
    startContract, endContract, parcels, maturityContract, valueContract, condominium, iptu, otherPrices, adjustment,
    readjustedRentDate, transfer, transferAmount, proportionalRent, firstProportionalInstallment, fireInsurance, valueFireInsurance,
    readjustmentIndex, fireInsuranceExpiration
}) {
    const data = {
        idProperty,title, idCompany, idLocator, nameLocator, cpfCnpjLocator, idClient, nameClient, cpfCnpjClient, idGuarantor,
    nameGuarantor, cpfCnpjGuarantor, type, subType, assurance, securityDeposit, typeNegotiation, newContract, status,
    startContract, endContract, parcels, maturityContract, valueContract, condominium, iptu, otherPrices, adjustment,
    readjustedRentDate, transfer, transferAmount, proportionalRent, firstProportionalInstallment, fireInsurance, valueFireInsurance,
    readjustmentIndex, fireInsuranceExpiration
    }

    await api.patch(`/contracts/${id}`, data).then((res) => {
        
        toast.success("Contrato criado com sucesso!");
        

        window.setTimeout(() =>{
            window.open("/contratos", "_self");
        }, 3000)
        
    }).catch((error) => {
        console.log(error)
    })
}
async function newContract({
    idProperty, title, idCompany, idLocator, nameLocator, cpfCnpjLocator, idClient, nameClient, cpfCnpjClient, emailClient, phoneClient, whatsappClient, idGuarantor,
    nameGuarantor, cpfCnpjGuarantor, type, subType, assurance, securityDeposit, typeNegotiation, newContract, status,
    startContract, endContract, parcels, maturityContract, valueContract, condominium, iptu, otherPrices, adjustment,
    readjustedRentDate, transfer, transferAmount, proportionalRent, firstProportionalInstallment, fireInsurance, valueFireInsurance, readjustmentIndex, fireInsuranceExpiration
}) {
    const data = {idProperty, title, idCompany, idLocator, nameLocator, cpfCnpjLocator, idClient, nameClient, cpfCnpjClient, emailClient, phoneClient, whatsappClient, idGuarantor,
        nameGuarantor, cpfCnpjGuarantor, type, subType, assurance, securityDeposit, typeNegotiation, newContract, status,
        startContract, endContract, parcels, maturityContract, valueContract, condominium, iptu, otherPrices, adjustment,
        readjustedRentDate, transfer, transferAmount, proportionalRent, firstProportionalInstallment, fireInsurance, valueFireInsurance, readjustmentIndex, fireInsuranceExpiration}

    await api.post("/contracts", data).then((res) => {
        
        toast.success("Contrato criado com sucesso!");
        updateStatusProperty({id: idProperty, availability: "Alugado"});

        window.setTimeout(() =>{
            window.open("/contratos", "_self");
        }, 3000)
        
    }).catch((error) => {
        console.log(error)
    })
}

//Novo agendamento
async function newScheduling({
    idClient, idProperty, idCompany,idEvaluation, titleProperty, imageProperty, email, phone, whatsapp, status, meet, nameClient,
  day, month, year, shift, hour, ownACar, location, address, similarProperties, amountOfPeople, dateCompleted, type
}) {
    const data = {idClient, idProperty, idCompany, idEvaluation, titleProperty, imageProperty, email, phone, whatsapp, status, meet, nameClient,
        day, month, year, shift, hour, ownACar, location, address, similarProperties, amountOfPeople, dateCompleted, type}

    await api.post("/scheduling/", data).then((res) => {
        
        toast.success("Agendamento criado com sucesso!");
        mailShedulingAvaluation({email, nameClient, meet, location, day, month, year, shift, hour})
        
       

    }).catch((error) => {
        console.log(error)
    })
}
async function updateDataSchedule({id, day, month, year, shift, hour, dateCompleted, email}) {
    const data = {day, month, year, shift, hour, dateCompleted, email}

    await api.patch(`/scheduling/date/${id}`, data).then((res) => {
        
        toast.success("Agendamento alterado com sucesso!");
        // mailShedulingUpdate({email})

    }).catch((error) => {
        console.log(error)
    })
}
async function updateStatusSchedule({id, status, email}) {
    console.log(status)
    console.log(id)
    console.log(email)
    const data = {status}
    await api.patch(`/scheduling/updateStatus/${id}`, data).then((res) => {
        
        toast.success("Agendamento alterado com sucesso!");
        //mailShedulingUpdate({email})

        // window.setTimeout(() =>{
        //     window.location.reload(false);
        // }, 3000)

    }).catch((error) => {
        console.log(error)
    })
}


async function mailShedulingUpdate({email}) {
    const data = {email}
    await apiMail.post("/mail/shedulingUpdate", data).then((res) => {
        console.log("Email enviado com sucesso!");
        toast.success("Email de agendamento enviado!");


    }).catch((error) => {
        console.log(error);
    });
};

async function mailShedulingAvaluation({email, nameClient, meet, location, day, month, year, shift, hour}) {
    console.log({email, nameClient, meet, location, day, month, year, shift, hour});

    const data = {email, nameClient, meet, location, day, month, year, shift, hour}

    await apiMail.post("/mail/shedulingAvaluation", data).then((res) => {
        console.log("Email enviado com sucesso!");
        toast.success("Email de agendamento enviado!");
      //  window.location.reload(false);
    }).catch((error) => {
        console.log(error);
    });
}


async function notifications(idPatrono, text,idAccount, idFriend, type,idPost) {
    const data = {idPatrono, text,idAccount, idFriend, type,idPost }
    await api.post("/notifications", data).then(() => {
        console.log("Comentário/Notificação feito com sucesso");
    }).catch(error => {
        console.log("Notificação não cadastrada" + error)
    })
}



async function deleteActualMessage(id){
    await api.delete(`/messages/${id}`).then(() => {
    })
}

async function newVisit(idAccount, username, idFriend) {
    const data = {idAccount, username, idFriend}
    await api.post("/visits", data).then(() => {
    })
}

// Propriedade
async function newProperty({
    id, idCompany,avatarCompany, nameCompany, title, number, cep, road, district, city, uf, description, type, subType, status,
    availability, bedroom, garage, suite, restroom, priceSale, priceRent, textRent, condominium, pets, furnished, newProperty, firstLease,
    iptu, otherPrices, buildingArea, siglaBuildingArea, totalArea, siglaTotalArea, yearOfConstruction,
    images, featuredImage, platformVideo, video, slider, financing, characteristcs, emphasis, idLocator,
    codeIptu, codeEnergy, codeWater, informations,
}) {

    const data  = {
        id, idCompany,avatarCompany, nameCompany, title, number, cep, road, district, city, uf, description, type, subType, status,
        availability, bedroom, garage, suite, restroom, priceSale, priceRent, textRent, condominium, pets, furnished, newProperty, firstLease,
        iptu, otherPrices, buildingArea, siglaBuildingArea, totalArea, siglaTotalArea, yearOfConstruction,
        images, featuredImage, platformVideo, video, slider, financing, characteristcs, emphasis, idLocator,
        codeIptu, codeEnergy, codeWater, informations,
        }
    await api.post("/property", data).then(() => {
        toast.success("Imóvel cadastrado com sucesso!");
        setTimeout(() => {
            window.open("/imoveis", "_self")
          }, "2000")
    }).catch(err => {
        console.log(err);
    })
}
async function updateProperty({
    id, idCompany,avatarCompany, nameCompany, title, number, cep, road, district, city, uf, complement, reference, description, type, subType, status,
    availability, bedroom, garage, suite, restroom, priceSale, priceRent, textRent, condominium, pets, furnished, newProperty, firstLease,
    iptu, otherPrices, buildingArea, siglaBuildingArea, totalArea, siglaTotalArea, yearOfConstruction,
    images, featuredImage, platformVideo, video, slider, financing, characteristcs, emphasis, idLocator,
    codeIptu, codeEnergy, codeWater, informations, }) {

    const data  = {
        idCompany,avatarCompany, nameCompany, title, number, cep, road, district, city, uf, complement, reference, description, type, subType, status,
        availability, bedroom, garage, suite, restroom, priceSale, priceRent, textRent, condominium, pets, furnished, newProperty, firstLease,
        iptu, otherPrices, buildingArea, siglaBuildingArea, totalArea, siglaTotalArea, yearOfConstruction,
        images, featuredImage, platformVideo, video, slider, financing, characteristcs, emphasis, idLocator,
        codeIptu, codeEnergy, codeWater, informations,
        }

    await api.patch(`/property/${id}`, data).then(() => {
        toast.success("Imóvel Atualizado com sucesso!");
        setTimeout(() => {
            window.open("/imoveis", "_self")
          }, "2000")
    }).catch(err => {
        console.log(err);
    })
}
async function newFeature({feature}) {
    const data  = {feature}
    await api.post("/features", data).then(() => {
    }).catch(err => {
        console.log(err);
    })
}


async function updateStatusProperty({id, availability}){
    const data = {availability};
    await api.patch(`/property/availability/${id}`, data).then(res => {
        toast.success("Imóvel atualizado com sucesso")
        // window.open("/imoveis", "_self")
    }).catch(error => {
        console.log(error)
    });
}


// Fim Propriedade


//Solicitação de site

async function newWebSite({ idCompany, status,website,websiteAddress, hosting, domain, companyDomain, emailProfessional,
            title, description, color, history, mission, vision, values, logo}) {
                const data = {idCompany, status,website,websiteAddress, hosting, domain, companyDomain, emailProfessional,
                    title, description, color, history, mission, vision, values, logo};
                await api.post(`/webSiteClient`, data).then(res => {
                    toast.success("Solicitação de website enviada com sucesso")
                    window.open("/meu-site", "_self")
                }).catch(error => {
                    console.log(error)
                });
            }

// Fim solicitação de site


  // Deslogandop após tempo de inatividade
   function inactivityTime() {
       let time;
       // reset timer
       window.onload = resetTimer;
       document.onmousemove = resetTimer;
       document.onkeydown = resetTimer;
       document.onclick = resetTimer;
       document.onchange = resetTimer;
       function doSomething() {
        const DataUser = localStorage.getItem("adm-suachave");
        const user = JSON.parse(DataUser);

            if(user !== null || user !== undefined || user !== "") {
              //  toast.error("Finalizando a sessão")
                logout(user.id)
            }
        }
        function resetTimer() {
        clearTimeout(time);
      time = setTimeout(doSomething, 900000)
      //time = setTimeout(doSomething, 1000)
    }
}

    return(
        <AuthContext.Provider value={{
            createAccountSquad,
            updateAccountCompany,
            loginSessionSquad,
            loginAndUpdatePassword,
            updateAccount,
            newFinancer,
            editFinancer,
            loading,
            logout,
            deleteActualMessage,
            newVisit,
            comentsPosts,
            setComentsPosts,
            deleteAccount,
            recuperationUserForEmail,
            gerateCodeRecuperation,
            validadeCodeRecuperation,
            recoverPasswordNew,
            inactivityTime,
            createPayment,
            deleteConversation,
            newProperty,
            updateProperty,
            updateStatusProperty,
            newClientCompany,
            updateClientCompany,
            deleteClientCompany,
            newCollaborator,
            newFeature,
            listPrint,
            handleListPrint,
            mewNegociation,
            newLocador,
            updateLocador,
            deleteLocatorCompany,
            deleteLocatorCompany,
            newGuarantor,
            updateGuarantor,
            deleteGuarantorCompany,
            deletePropertyCompany,
            deleteContractCompany,
            newScheduling,
            newContract,
            updateContract,
            updateStatusSchedule,
            updateDataSchedule,
            newWebSite
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}