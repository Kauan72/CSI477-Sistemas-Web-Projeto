import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from "./App"
import ListVideos from "./componentes/videos/ListVideos"
import AddVideos from "./componentes/videos/AddVideo"
import UpdateVideo from "./componentes/videos/UpdateVideo"
import ExibeVideo from "./componentes/player/ExibeVideo"
import CompromissosDia from "./componentes/compromissos/CompromissosDia"
import AddCompromisso from "./componentes/compromissos/AddCompromisso"
import UpdateCompromisso from "./componentes/compromissos/UpdateCompromisso"
import ListTags from "./componentes/tags/ListTags"
import AddTag from "./componentes/tags/AddTag"


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<ExibeVideo/>}></Route>
          <Route path="/gerenciarvideos" element={<ListVideos />} />
          <Route path="/gerenciarvideos/adicionarvideos" element={<AddVideos />} />
          <Route path="/gerenciarvideos/atualizarvideos/:id" element={<UpdateVideo/>}></Route>
          <Route path="/compromissos/:date" element={<CompromissosDia />} />
          <Route path="/compromissos/novo/:date" element={<AddCompromisso />} />
          <Route path="/compromissos/update/:id" element={<UpdateCompromisso />} />
          <Route path="/gerenciartags" element={<ListTags />} />
          <Route path="/gerenciartags/adicionartag" element={<AddTag />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes