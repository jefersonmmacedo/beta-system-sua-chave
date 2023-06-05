import "./signUpProfessional.css";
import Logo from "../../assets/images/Logo.png";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth";
import { toast } from 'react-toastify';
import {IoEyeOutline, IoEyeOffOutline, IoSearchOutline} from 'react-icons/io5';
import { mask as masker, unMask } from "remask";
import { storage } from '../../services/firebaseConnection';
import { ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import buscaCep from "../../services/api-buscaCep";
import { useParams } from "react-router-dom";
import slugify from 'react-slugify';

export function SignUpProfessional() {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [imageAvatar, setImageAvatar] = useState('');

    const {createAccountSquad} = useContext(AuthContext)
    const profile = "https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?b=1&s=170667a&w=0&k=20&c=7WCqA9IZcIhn6UQbi6Kx1EtdnhEgVOOHwLi0rTMtbCo="

    const [passwordView, setPasswordView] = useState(false)
  
    const [name, setName] = useState("");
    const [fantasyName, setFantasyName] = useState("");
    const [cpf_Cnpj, setCpf_Cnpj] = useState("");
    const [rg, setRg] = useState("");
    const [profession, setProfession] = useState("");
    const [numberRegister, setNumberRegister] = useState("");
    const [register, setRegister] = useState("");
    const [birthday, setBirthday] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [password, setPassword] = useState("");

    const [cep, setCep] = useState("");
    const [number, setNumber] = useState("");
    const [road, setRoad] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [uf, setUf] = useState("");
    const [reference, setReference] = useState("");
    const [complement, setComplement] = useState("");


    console.log(slugify(fantasyName))
    function handleFile(e) {
        // console.log(e.target.files[0])
        if(e.target.files[0]){
            const image = e.target.files[0];
            if(image.type === 'image/jpeg' || image.type === 'image/jpg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
                console.log(avatarUrl);
             } else {
                 console.log('Tipo dearquivo não aceito. Envie uma imagem dos tipos: .jpg, .jpeg, .png');
                 setImageAvatar(null);
                 return null;
             }
         }
     }

      async function handleNewAccount(e) {
        e.preventDefault();

        toast.info("Criando conta. Aguarde...")
                //Avatar
        const uuid = uuidv4();

        let newAvatarUrlFirebase = ref(storage, `images/avatarCompany/${uuid}`);
        let uploadAvatar = await uploadBytes(newAvatarUrlFirebase, imageAvatar);
        let photoUrlAvatar = await getDownloadURL(uploadAvatar.ref);
            
        console.log(uploadAvatar.ref.name, photoUrlAvatar);
        continueNewAccount(photoUrlAvatar)
      }

    function continueNewAccount(photoUrlAvatar) {
      createAccountSquad({
          avatar: photoUrlAvatar, name, nameSlug: slugify(name), fantasyName, rg, cpf_Cnpj, profession, birthday, numberRegister, register,
          email, phone, whatsapp, cep, road, number, district, city, uf, password,
        })
    }

    function ChangeMaskPhone(e) {
        const originalValue = unMask(e.target.value);
        const maskedValue = masker(originalValue, [
          "(99)99999-9999",
          "(99)99999-999",
        ]);
    
        setPhone(maskedValue)
      }
    function ChangeMaskWhatsapp(e) {
        const originalValue = unMask(e.target.value);
        const maskedValue = masker(originalValue, [
          "(99)99999-9999",
          "(99)99999-999",
        ]);
    
        setWhatsapp(maskedValue)
      }

      function handlePasswordView() {
        if(passwordView === false) {
          setPasswordView(true)
        } else {
          setPasswordView(false)
        }
      }

      async function handleSearchCep(e) {
        e.preventDefault();
        try {
          const res = await buscaCep.get(`${cep}/json`) 
            console.log(res.data);

            setRoad(res.data.logradouro);
            setDistrict(res.data.bairro);
            setCity(res.data.localidade);
            setUf(res.data.uf);
            return;
          }catch{
            console.log("error")
        }
        return
    }



      function handleRegister(e) {
        setRegister(e.target.value);
      }



    return (
        <div className="SignUpProfessional">
            <div className="professional">
                <div className="block">
                </div>
            </div>
            <div className="login">
                <form action="">
                <img src={Logo} alt="Logo GPS Buscador" />
                      
                    
                        <div className="data">
                            <div className="dataInfo">
                            <h5>Sua Logo</h5>
                        <label className="label-avatar">
                            {/* <span><FiUpload color="#f65" size={25} /></span> */}
                            <input type="file" accept="image/*" onChange={handleFile} required/><br />
                            <img src={avatarUrl === null ? profile : avatarUrl} alt="Avatar" height={100} width={100}/>
                        </label>

                           <h5>Dados da conta</h5>
                           <span>Nome completo</span>
                        <input type="text" placeholder="" value={name} onChange={(e) => setName(e.target.value)} />
                           <span>Nome tratamento</span>
                        <input type="text" placeholder="" value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} />
                           <span>CPF/CNPJ</span>
                        <input type="text" placeholder="" value={cpf_Cnpj} onChange={(e) => setCpf_Cnpj(e.target.value)} />
                           <span>RG</span>
                        <input type="text" name="date" id="date" className="date" placeholder="" value={rg} onChange={(e) => setRg(e.target.value)} />
                           <span>Data de Nascimento</span>
                        <input type="date" placeholder="" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                           <span>E-mail</span>
                        <input type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} />
                           <span>Telefone</span>
                        <input type="text" placeholder="" value={phone} onChange={ChangeMaskPhone} />
                           <span>Whatsapp</span>
                        <input type="text" placeholder="" value={whatsapp} onChange={ChangeMaskWhatsapp} />
                           <span>Senha</span>
                        <div className="dataInputs">
                        <input type={passwordView === false ? "password" : "text"}  placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="icon" onClick={handlePasswordView}>{passwordView === false ? <IoEyeOutline /> : <IoEyeOffOutline /> }
                        </div>
                        </div>
                        <div className="dataInputs">
                        <input type={passwordView === false ? "password" : "text"} placeholder="Confirmar senha" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                        <div className="icon"onClick={handlePasswordView}>{passwordView === false ? <IoEyeOutline /> : <IoEyeOffOutline /> }
                            </div>
                        </div>

                        { password !== passwordConfirm && password !== "" && passwordConfirm !== "" ?
                        <h6>As senhas não coincidem</h6>
                        : ""
                        }
                            </div>                       
                        </div>
                       
                        <div className="data">
                          <div className="dataInfo">
                          <h5>Profissão</h5>
                          <span>Profissão</span>
                         <input type="text" placeholder="" value={profession} onChange={(e) => setProfession(e.target.value)} />
                         <span>Tipo de registro</span>
                         <select value={register} onChange={handleRegister}>
                          <option value="Selecione">Selecione</option>
                          <option value="Creci">Creci</option>
                          <option value="OAB">OAB</option>
                          <option value="CRA">CRA</option>
                          <option value="CFA">CFA</option>
                          <option value="CAU">CAU</option>
                          <option value="CRESS">CRESS</option>
                          <option value="CFESS">CFESS</option>
                          <option value="CRB">CRB</option>
                          <option value="CFB">CFB</option>
                          <option value="CONRERP">CONRERP</option>
                          <option value="CRT">CRT</option>
                        </select>
                        <span>Número de registro</span>
                        <input type="text" placeholder="" value={numberRegister} onChange={(e) => setNumberRegister(e.target.value)} />
                       
                          </div>                      
                        </div>

                    
                        <div className="data">
                          <div className="dataInfo">
  
                        <div className="BuscaCep">
                        <input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)}  />
                        <button onClick={handleSearchCep}><IoSearchOutline /></button>
                        </div>
                        <h5>Busque o CEP antes de preencher os dados</h5>
                         <input type="text" placeholder="Rua" value={road} onChange={(e) => setRoad(e.target.value)}  />
                         <div className="infoAdress">
                         <input type="text" placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)}  />
                         <input type="text" placeholder="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)}  />
                         </div>
                        <input type="text" placeholder="Bairro" value={district} onChange={(e) => setDistrict(e.target.value)}  /> 

                        {city !== "" && uf !== "" ?
                        <>
                        <input type="text" placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)}  />
                        <div className="infoAdress">
                        <input type="text" placeholder="Estado(UF)" value={uf} onChange={(e) => setUf(e.target.value)}  />
                        <input type="text" placeholder="Referência" value={reference} onChange={(e) => setReference(e.target.value)}  />
                        </div>
                        </>
                        : ""
                        } 


                          </div>



                        <div className="buttons">
                         {avatarUrl !== null ? 
                        <button className="btn5" onClick={handleNewAccount}>Cadastrar</button>
                         : ""                        
                          }
                        </div>

                       
                         </div>
                     

                  
                </form>

            </div>
        </div>
    )
}