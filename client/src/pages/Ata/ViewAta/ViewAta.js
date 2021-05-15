import { Button, Container, Grid, Typography, useTheme } from "@material-ui/core";
import { Link, useLocation, useHistory } from "react-router-dom";

import AtaHeader from "../../../components/Ata/ViewAta/AtaHeader";
import ProjectParticipants from "../../../components/Ata/ViewAta/ProjectParticipants";
import Pauta from "../../../components/Ata/ViewAta/Pauta";
import Topics from "../../../components/Ata/ViewAta/Topics";
import { useEffect, useState } from "react";
import "../CreateAta/Style.css";
import ataServices from "../../../services/ata";
import Status from "../../../components/Ata/ViewAta/Status";
import { useInfoAta } from "../../../context/InfoAta";
import Loading from "../../Loading/Loading";

const ViewAta = ({ ajustarLayout }) => {
  const theme = useTheme();
  const { setInfoAta, infoAta } = useInfoAta();
  const [isLoading, setIsLoading] = useState(true);

  const [idAta, setIdAta] = useState();

  const location = useLocation();
  const history = useHistory();
  const formatDate = (date) => {
    const data = new Date(date).toLocaleDateString();
    return data;
  };

  const formatTime = (time) => {
    const tempo = time.join(":");
    return tempo;
  };

  useEffect(() => {
    const idBuscar = location.state.id;

    // Id sem a barra "/"
    ataServices
      .pegarAta(idBuscar.split("/").join(""))
      .then((res) => {
        const dados = res.data;
        setIdAta(dados.ataId);
        const infoHeader = {
          ataId: dados.ataId,
          ataDataInicio: formatDate(dados.ataDataInicio),
          ataHoraInicio: formatTime(dados.ataHoraInicio),
          ataDataFim: formatDate(dados.ataDataFim),
          ataHoraFim: formatTime(dados.ataHoraFim),
          ataLocal: dados.ataLocal,
        };
        const infoProject = {
          ataProjeto: dados.ataProjeto,
          participantes: dados.participaAtas,
        };
        setInfoAta({
          header: infoHeader,
          projeto: infoProject,
          pauta: dados.ataPauta,
          assuntos: dados.assuntos,
        });
      })
      .catch((err) => console.log("erro:", err.message))
      .finally(() => setIsLoading(false));

    // Ao desmontar o componente, limpar as informações da ata
    return () => {
      setInfoAta({
        header: "",
        projeto: "",
        pauta: "",
        assuntos: [],
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  // Alterna entre os estados "Open" e "Close" da lista
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <Grid container style={{ marginBottom: 10 }}>
            <Typography style={{ paddingLeft: 24, fontSize: "1.4rem" }}>Cabeçalho</Typography>
            <AtaHeader header={infoAta.header} ajustarLayout={ajustarLayout} />
          </Grid>
          <Grid container style={{ marginBottom: 10 }}>
            <Typography style={{ paddingLeft: 24, fontSize: "1.4rem" }}>ATA de Reunião</Typography>
            <ProjectParticipants infoProject={infoAta.projeto} />
          </Grid>
          <Grid container style={{ marginBottom: 10 }}>
            <Typography style={{ paddingLeft: 24, fontSize: "1.4rem" }}>Pauta</Typography>
            <Pauta infoPauta={infoAta.pauta} />
          </Grid>
          <Grid container style={{ marginBottom: 10 }}>
            <Topics isOpen={isOpen} handleClick={handleClick} infoTopics={infoAta.assuntos} />
          </Grid>
          {/* <Grid container style={{ marginBottom: 10 }}>
            <Typography style={{ paddingLeft: 24, fontSize: "1.4rem" }}>Status</Typography>
            <Status />
          </Grid> */}
          <Grid container justify="space-between" style={{ padding: 24 }}>
            <Link to="/visualizar-atas" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                className="bold"
                style={{
                  backgroundColor: "white",
                  color: theme.palette.secondary.main,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  borderRadius: 16,
                  padding: "0 5px",
                }}
              >
                Cancelar
              </Button>
            </Link>
            <Button
              variant="contained"
              color="secondary"
              className="bold"
              style={{
                color: "white",
                fontSize: "1.5rem",
                borderRadius: 16,
                padding: "0 5px",
              }}
              onClick={handleClick}
            >
              Visualizar Assuntos
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="bold"
              style={{
                color: "white",
                fontSize: "1.5rem",
                borderRadius: 16,
                padding: "0 5px",
              }}
            >
              Revisões Pendentes
            </Button>
            <Link to="/revisoes" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                className="bold"
                style={{
                  color: "white",
                  fontSize: "1.5rem",
                  borderRadius: 16,
                  padding: "0 5px",
                }}
              >
                Visualizar Revisões
              </Button>
            </Link>

            <Button
              variant="contained"
              color="secondary"
              className="bold"
              style={{
                color: "white",
                fontSize: "1.5rem",
                borderRadius: 16,
                padding: "0 5px",
              }}
              onClick={() => history.push("nova-revisao", { user: 1, ataid: idAta })}
            >
              Nova Revisão
            </Button>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default ViewAta;
