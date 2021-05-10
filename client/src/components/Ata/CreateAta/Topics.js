import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  Input,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { AddCircle, Delete, ExpandMore } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";
import { styles } from "../../../assets/styles/Styles";
import "./Components.css";

const Topics = (props) => {
  const { classes, listaAdicionados, setInfoTopics, ataId } = props;

  const [atual, setAtual] = useState("");
  const [idPessoa, setIdPessoa] = useState("");

  const [assunto, setAssunto] = useState("");
  const [idAtual, setIdAtual] = useState(1);
  const [listaAssuntos, setListaAssuntos] = useState([]);

  const [datetime, setDatetime] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleAddition = () => {
    if (atual && assunto && datetime && idPessoa) {
      const d = new Date();
      const newTopic = {
        assId: idAtual,
        assAssunto: assunto,
        ataId: ataId,
        inCharge: atual,
        assPrazo: datetime + ":" + d.getSeconds() + "." + d.getMilliseconds() + "+00:00",
        responsavelAssuntos: [
          {
            usuId: idPessoa,
          },
        ],
      };
      setListaAssuntos([...listaAssuntos, newTopic]);
      setIdAtual(idAtual + 1);
      setInfoTopics([...listaAssuntos, newTopic]);
    }
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  // Rastreia o participante atualmente escolhido
  const getPerson = (person) => {
    if (person) {
      setAtual(person.usuNome);
      setIdPessoa(person.usuId);
    } else {
      setAtual("");
      setIdPessoa("");
    }
  };

  const handleDelete = (id) => {
    let newId = id;
    let newList = [...listaAssuntos];
    newList.splice(id - 1, 1);

    if (newList.length) {
      for (let i = id - 1; i < newList.length; i++) {
        let topic = newList[i];
        topic.id = newId;
        newId = newId + 1;
      }
      setListaAssuntos(newList);
      setInfoTopics(newList);
      newId = newList[newList.length - 1].id + 1;
      setIdAtual(newId);
    } else {
      setIdAtual(1);
      setListaAssuntos([]);
      setInfoTopics([]);
    }
  };

  const formatDatetime = (datetime) => {
    //":" + d.getSeconds() + "." + d.getMilliseconds() + "+00:00"
    let [date, time] = datetime.split("T");
    date = date.split("-").reverse().join("/");
    let hour = time.split(":");
    const formated = date + " " + hour.splice(0, 2).join(":");
    return formated;
  };

  const options = listaAdicionados.map((option) => {
    const firstLetter = option.usuNome[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  return (
    <Container>
      <Grid item xs={12}>
        <Grid container className={classes.grid} style={{ padding: 0 }} alignItems="stretch" justify="space-between">
          <Grid container>
            <Grid item xs={11}>
              <Grid
                container
                className={classes.grid}
                style={{ padding: 0 }}
                alignItems="center"
                justify="space-around"
              >
                <Grid item className="no-margin">
                  <Grid container justify="center">
                    <Grid item style={{ margin: 10 }}>
                      <Typography align="center" className={classes.normalText} style={{ textAlign: "center" }}>
                        ID
                      </Typography>
                      <Typography align="center" className={classes.normalText} style={{ textAlign: "center" }}>
                        {idAtual}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={8} xs={12} className="no-margin">
                  <Grid container justify="space-around">
                    {windowWidth >= 960 && (
                      <Divider orientation="vertical" style={{ backgroundColor: "white" }} flexItem />
                    )}
                    <Grid item md={5} sm={7} xs={9} style={{ margin: 10 }}>
                      <Grid container justify="space-around">
                        <FormLabel htmlFor="assunto" className={classes.normalText}>
                          Assunto
                        </FormLabel>
                        <Input
                          className={classes.textField}
                          id="assunto"
                          disableUnderline
                          value={assunto}
                          onChange={(e) => setAssunto(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    {windowWidth >= 960 && (
                      <Divider orientation="vertical" style={{ backgroundColor: "white" }} flexItem />
                    )}
                    <Grid item md={5} sm={7} xs={9} style={{ margin: 10 }}>
                      <Grid container justify="center">
                        <FormLabel htmlFor="responsavel" className={classes.normalText}>
                          Responsável
                        </FormLabel>
                        <Autocomplete
                          id="responsavel"
                          className="no-margin"
                          style={{ width: "100%" }}
                          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                          groupBy={(option) => option.firstLetter}
                          getOptionLabel={(option) => option.usuNome}
                          onChange={(e, value) => getPerson(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className={classes.textField}
                              style={{ padding: 0 }}
                              name="participante"
                              disableUnderline
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    {windowWidth >= 960 && (
                      <Divider orientation="vertical" style={{ backgroundColor: "white" }} flexItem />
                    )}
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} className="no-margin">
                  <Grid container justify="space-around" alignItems="center">
                    <Grid item md={12} sm={7} xs={9} style={{ margin: 10 }}>
                      <Grid container justify="space-around" alignItems="center">
                        <FormLabel htmlFor="prazo" className={classes.normalText}>
                          Prazo
                        </FormLabel>
                        <Input
                          className={classes.textField}
                          disableUnderline
                          id="prazo"
                          type="datetime-local"
                          value={datetime}
                          onChange={(e) => setDatetime(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Grid container justify="flex-end" alignItems="flex-end" style={{ height: "100%" }}>
                <IconButton className="no-margin" onClick={handleAddition}>
                  <AddCircle className="largeIcon" style={{ color: "white" }}></AddCircle>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {listaAssuntos.length !== 0 && (
          <Grid item xs={11} style={{ margin: 10 }}>
            <Grid container justify="center">
              <Grid item xs={9} sm={9}>
                <Accordion
                  style={{
                    backgroundColor: props.theme.palette.secondary.main,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Grid container justify="center">
                      <Typography style={{ color: "white" }} className={classes.normalText}>
                        Assuntos adicionados
                      </Typography>
                    </Grid>
                  </AccordionSummary>
                  <Grid container justify="space-around">
                    {listaAssuntos.map((topic, index) => {
                      return (
                        <Grid item xs={8} md={5}>
                          <AccordionDetails key={index + 1} style={{ width: "100%" }}>
                            <Grid item xs={12}>
                              <Accordion style={{ width: "100%" }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                  <Grid container alignItems="center" justify="space-between">
                                    <Grid item xs={3}>
                                      <IconButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(index + 1);
                                        }}
                                        onFocus={(e) => e.stopPropagation()}
                                        key={index + 1}
                                        color="secondary"
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Grid>
                                    <Grid item xs>
                                      <Typography style={{ color: "black" }}>
                                        <strong>
                                          {topic.assId} - {topic.assAssunto}
                                        </strong>
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </AccordionSummary>
                                <AccordionDetails key={index + 1} className="no-margin">
                                  <Grid container justify="center">
                                    <Grid item>
                                      <Typography style={{ padding: 10 }}>{topic.inCharge}</Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography style={{ padding: 10 }}>{formatDatetime(topic.assPrazo)}</Typography>
                                    </Grid>
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            </Grid>
                          </AccordionDetails>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Accordion>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(Topics);
