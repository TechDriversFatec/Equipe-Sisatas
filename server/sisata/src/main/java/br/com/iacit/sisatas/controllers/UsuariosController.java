package br.com.iacit.sisatas.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.iacit.sisatas.mapper.UsuarioMapper;
import br.com.iacit.sisatas.models.UsuariosModel;
import br.com.iacit.sisatas.projections.UsuariosProjectionDataGrid;
import br.com.iacit.sisatas.projections.UsuariosProjectionParticipante;
import br.com.iacit.sisatas.repository.UsuariosRepository;
import br.com.iacit.sisatas.returns.MessageReturn;

@Controller
@RequestMapping("/usuarios")
public class UsuariosController {
	
	/**
	 * @Author Daniel Oliveira
	 * 
	 * Atribuição à variável <up> os métodos implementados de JpaRepository<>,
	 * via interface <br.com.iacit.sisatas.repository.UsuariosRepository>
	 *
	 */
	
	@Autowired
	private UsuariosRepository up;
	
	
	/**
	 * @Author Daniel Oliveira
	 *
	 * Valida se e-mail já está cadastrado no DB.
	 *
	 */
	@ResponseBody
	@RequestMapping(value = "/validadorUsuEmail", method = RequestMethod.GET)
	public Boolean validadorUsuEmail(@RequestParam String usuEmail) {
		return up.existsByusuEmail(usuEmail);
	}
	
	/**
	 * @Author Daniel Oliveira
	 * 
	 * METHOD: POST; Para cadastrar Usuários.
	 * URL: http://localhost:8080/usuarios/cadastrarUsuarios
	 *
	 		imagem: multipart/form-data
    		"usuNome": "<String>",
    		"usuEmail": "<String>",
    		"usuTelefone": "<String>",
    		"usuCargo": "<String>",
    		"usuAreaEmpresa": "<String>",
    		"usuPerfil" : <Long>
	
	 * 
	 * RETURN: Retorna um objeto <result> MessageReturn(
	 * 	String operacao;
	 *  Boolean erro;
	 *  String mensagem;
	 * )
	 * operacao: "cadastrarUsuarios";
	 * erro: true, erro ao realizar a persistência ou e-mail já cadastrado; false: persistência realizada com sucesso.
	 * mensagem: mensagem definida manualmente ou caso haja exceção <e.getMessage()>
	 * 
	 */ 
	
	@ResponseBody
	@RequestMapping(value = "/cadastrarUsuarios", method = RequestMethod.POST, consumes = { "multipart/form-data" })
	public MessageReturn cadastrarUsuario(MultipartFile imagem, String usuario) throws IOException {
		MessageReturn result = new MessageReturn();
		
		result.setOperacao("cadastrarUsuarios");
		
		ObjectMapper mapper = new ObjectMapper();
		UsuariosModel pessoa = null;

		try {

			pessoa = mapper.readValue(usuario, UsuariosModel.class);
			// Validar unicidade de e-mail.
			
			if (!up.existsByusuEmail(pessoa.getUsuEmail())) {
				// Validar se a imagem é difente de null,
				// Caso seja null, não será feito o mapeamento da imagem, para não gerar erros.
				if (!imagem.equals(null)) {
					// save os dados no DB, antes, faz o mepeamento dos dados e da imagem.
					up.save(UsuarioMapper.converter(pessoa, imagem));
				} else {
					// save os dados no DB, sem imagem/assinatura.
					up.save(pessoa);
				}
				result.setMensagem("Usuário cadastrado com sucesso.");
				result.setErro(false);
			} else {
				result.setMensagem("E-mail já cadastrado. Usuário não cadastrado.");
				result.setErro(true);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.setMensagem(e.getMessage());
			result.setErro(true);
		}
		return result;
	}
	
	/**
	 * @Author Daniel Oliveira
	 * 
	 * METHOD: PUT; Para atualizar Usuários.
	 * URL: http://localhost:8080/usuarios/atualizarUsuarios
	 * BODY: 
	 *  	imagem: multipart/form-data
	 *  	"usuId": Long,
    		"usuNome": "<String>",
    		"usuEmail": "<String>",
    		"usuTelefone": "<String>",
    		"usuCargo": "<String>",
    		"usuAreaEmpresa": "<String>",
    		"usuAssinatura": "<String>",
    		"usuPerfil" : <Long>		

		<usuId> deverá ser informado, pois será utilizado como referência para realizar a atualização;
	 * 
	 * RETURN: Retorna um objeto <result> MessageReturn(
	 * 	String operacao;
	 *  Boolean erro;
	 *  String mensagem;
	 * )
	 * operacao: "atualizarUsuarios";
	 * erro: true, erro ao realizar a persistência ou e-mail já cadastrado; false: persistência realizada com sucesso.
	 * mensagem: mensagem definida manualmente ou caso haja exceção <e.getMessage()>
	 * 
	 */ 
	
	@ResponseBody
	@RequestMapping(value = "/atualizarUsuarios", method = RequestMethod.PUT, consumes = { "multipart/form-data" })
	public MessageReturn atualizarUsuarios(MultipartFile imagem, String usuario) {
		MessageReturn result = new MessageReturn();

		result.setOperacao("atualizarUsuarios");

		ObjectMapper mapper = new ObjectMapper();
		UsuariosModel usuarioController = null;

		try {
			// Mapeia o usuário vindo do front para UsuariosModel;
			usuarioController = mapper.readValue(usuario, UsuariosModel.class);
			// Constroi o objeto, para comparar os emails antes de fazer a atualização;
			UsuariosModel usuarioBanco = up.findByusuId(usuarioController.getUsuId());

			// Verifica se o e-mail salvo no banco é o mesmo enviado do front;
			if (!usuarioBanco.getUsuEmail().equals(usuarioController.getUsuEmail())) {

				// Validar unicidade de e-mail.
				if (!up.existsByusuEmail(usuarioController.getUsuEmail())) {
					// Validar se a imagem é difente de null,
					// Caso seja null, não será feito o mapeamento da imagem, para não gerar erros.
					if (imagem != null) {
						// save os dados no DB, antes, faz o mepeamento dos dados e da imagem.
						up.save(UsuarioMapper.converter(usuarioController, imagem));
					} else {
						// save os dados no DB, antes, faz o mepeamento dos dados sem a imagem.
						up.save(usuarioController);
					}
					result.setMensagem("Usuário atualizado com sucesso.");
					result.setErro(false);
				} else {
					result.setMensagem("E-mail já cadastrado. Usuário não atualizado.");
					result.setErro(true);
				}
			} else {
				// Validar se a imagem é difente de null,
				// Caso seja null, não será feito o mapeamento da imagem, para não gerar erros.
				if (imagem != null) {
					// save os dados no DB, antes, faz o mepeamento dos dados e da imagem.
					up.save(UsuarioMapper.converter(usuarioController, imagem));
				} else {
					// save os dados no DB, antes, faz o mepeamento dos dados sem a imagem.
					up.save(usuarioController);
				}
				result.setMensagem("Usuário atualizado com sucesso.");
				result.setErro(false);
			}

		} catch (Exception e) {
			e.printStackTrace();
			result.setMensagem(e.getMessage());
			result.setErro(true);
		}
		return result;
	}
	
	/**
	 * @Author Daniel Oliveira
	 * 
	 * METHOD: GET; Para listar Usuários.
	 * URL: http://localhost:8080/usuarios/listarUsuarios
	 * PARAM: lista
	 * 
	 * DataGrid ou Participante
	 * 
	 * RETURN: Retorna uma Lista <usuarios> List<UsuariosProjectionDataGrid> ou List<UsuariosProjectionParticipante>;
	 *
	 */

	
	@ResponseBody
	@RequestMapping(value = "/listarUsuarios", method = RequestMethod.GET)
	public List<?> listarUsuarios(@RequestParam String lista) {
		
		List<?> usuarios= null;
		
		switch (lista) {
		case "DataGrid":
			try {
				usuarios = up.findBy(UsuariosProjectionDataGrid.class);
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			break;
		case "Participante":
			try {
				usuarios = up.findBy(UsuariosProjectionParticipante.class);
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			break;
		default:
			break;
		}
		return usuarios;
	}

	/*
	@ResponseBody
	@RequestMapping(value = "/listarUsuarios", method = RequestMethod.GET)
	public MessageReturn listarUsuarios(@RequestParam String lista) {
		
		MessageReturn result = new MessageReturn();

		result.setOperacao("listarUsuarios");
		List<?> usuarios= null;
		
		switch (lista) {
		case "DataGrid":
			try {
				
				usuarios = up.findBy(UsuariosProjectionDataGrid.class);
				result.setMensagem("Listagem realizada com sucesso.");
				result.setErro(false);
				result.setData(usuarios);
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			break;
		case "Participante":
			try {
				usuarios = up.findBy(UsuariosProjectionParticipante.class);
				result.setMensagem("Listagem realizada com sucesso.");
				result.setErro(false);
				result.setData(usuarios);
				
			} catch (Exception e) {
				e.printStackTrace();
				result.setMensagem(e.getMessage());
				result.setErro(true);
			}
			break;
		default:
			break;
		}
		return result;
	} */
	
	/**
	 * @author Denis Lima
	 * 
	 * METHOD: GET; Para pegar apenas 1 usuário.
	 * URL: http://localhost:8080/usuarios/pegarUsuario/{usu_id}
	 * 
	 * PathVariable: {usu_id}
	 * 
	 * RETURN: Retorna um usuário <UsuariosModel>;
	 *
	 */

	@ResponseBody
	@RequestMapping(value = "/pegarUsuario/{usu_id}", method = RequestMethod.GET)
	public UsuariosModel pegarUsuario(@PathVariable long usu_id) {
		UsuariosModel usuarioSelecionado = null;
		try {
			usuarioSelecionado = up.findByusuId(usu_id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return usuarioSelecionado;	
	}
	

	/**
	 * @Author Daniel Oliveira
	 * @Updated Denis Lima
	 * 
	 * METHOD: DELETE; Para excluir Usuários.
	 * URL: http://localhost:8080/usuarios/excluirUsuarios/{usu_id}
	 * 
	 * PathVariable: {usu_id}
	 * 
	 * RETURN: Retorna uma String <result>;
	 * result = "Exclusão realizada com sucesso.";
	 * result = "Mensagem da exceção apresentada.", caso ocorra.
	 *
	 */
	
	@ResponseBody
	@RequestMapping(value = "/excluirUsuarios/{usu_id}", method = RequestMethod.DELETE)
	public String excluirUsuarios(@PathVariable long usu_id) {
		String result = null;
		try {
			UsuariosModel usuarioSelecionado = up.findByusuId(usu_id);
			up.delete(usuarioSelecionado);
			result = "Exclusão realizada com sucesso.";
		} catch (Exception e) {
			result = e.getMessage();
		}
		return result;
	}
}