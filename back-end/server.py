# fixly/back-end/server.py

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json

# Instalações necessárias: pip install Flask flask-cors firebase-admin
from firebase_admin import credentials, initialize_app, firestore

# --- Configuração do Firebase ---
# 🎯 NOME DO ARQUIVO FORNECIDO PELO USUÁRIO
SERVICE_ACCOUNT_FILE = 'fixly-1d67e-firebase-adminsdk-fbsvc-9dc0ef50fb.json' 

# Configura o Flask para saber onde estão os arquivos estáticos (na pasta 'front-end')
STATIC_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'front-end')
app = Flask(__name__, static_folder=STATIC_FOLDER)
CORS(app) 

# Inicializa o Firebase
try:
    # Obtém o caminho completo para a chave de serviço
    chave_path = os.path.join(os.path.dirname(__file__), SERVICE_ACCOUNT_FILE)
    
    # Verifica se o arquivo existe antes de inicializar
    if not os.path.exists(chave_path):
        raise FileNotFoundError(f"Arquivo de chave não encontrado: {SERVICE_ACCOUNT_FILE}")
        
    cred = credentials.Certificate(chave_path)
    initialize_app(cred)
    db = firestore.client() 
    print("✅ Firebase inicializado e conectado ao Firestore!")
except Exception as e:
    print(f"❌ ERRO FATAL ao inicializar o Firebase. Verifique o nome do arquivo JSON: {e}")
    # Se der erro, o servidor não deve iniciar corretamente.

# --- Rotas de Serviço de Arquivos Estáticos ---
# Permite ao Flask servir o HTML, CSS e JS do front-end
@app.route('/', defaults={'path': 'html/dashboard.html'})
@app.route('/<path:path>')
def serve_file(path):
    if path == '':
        path = 'html/dashboard.html'
    if '/' not in path and path.endswith('.html'):
         path = 'html/' + path
    
    # As requisições de API não devem passar por aqui
    if path.startswith('api/'):
        return jsonify({"error": "API route not found"}), 404

    try:
        return send_from_directory(STATIC_FOLDER, path)
    except:
        return jsonify({"error": "File not found"}), 404

# --- Endpoints da API (Firestore) ---

@app.route('/api/areas', methods=['GET', 'POST'])
def handle_areas():
    if request.method == 'POST':
        data = request.json
        nome_area = data.get('nome')
        
        # 1. VALIDAÇÃO: Verifica se a área já existe
        area_existente = list(db.collection('areas').where('nome', '==', nome_area).limit(1).get())
        if area_existente:
             return jsonify({'error': 'Área já existe.'}), 400

        # 2. SALVA NO FIRESTORE
        try:
            doc_ref = db.collection('areas').add({'nome': nome_area})
            doc_id = doc_ref[1].id
            
            return jsonify({'message': 'Área criada com sucesso!', 'id': doc_id}), 201
        except Exception as e:
             return jsonify({'error': str(e)}), 500
    
    # Lógica GET para buscar todas as áreas
    areas_firestore = db.collection('areas').order_by('nome').get()
    areas = []
    for doc in areas_firestore:
        area_data = doc.to_dict()
        area_data['id'] = doc.id 
        areas.append(area_data)
        
    return jsonify(areas)


@app.route('/api/equipamentos', methods=['GET', 'POST'])
def handle_equipamentos():
    if request.method == 'POST':
        data = request.json
        try:
            if not isinstance(data.get('periodicidade_dias'), int) or data['periodicidade_dias'] <= 0:
                raise ValueError("Periodicidade deve ser um número inteiro positivo.")
            datetime.strptime(data['data_ultima_manutencao'], '%Y-%m-%d')
            
            equipamento_data = {
                'area_id': data['area_id'], 
                'nome': data['nome'],
                'descricao': data['descricao'],
                'periodicidade_dias': data['periodicidade_dias'],
                'data_ultima_manutencao': data['data_ultima_manutencao']
            }
            db.collection('equipamentos').add(equipamento_data)
            
            return jsonify({'message': 'Equipamento criado com sucesso!'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    # Lógica GET para buscar e calcular status
    equipamentos_firestore = db.collection('equipamentos').get()
    lista_processada = []
    
    areas_map = {}
    areas_docs = db.collection('areas').get()
    for doc in areas_docs:
        areas_map[doc.id] = doc.to_dict().get('nome', 'Área Desconhecida')

    for doc in equipamentos_firestore:
        item = doc.to_dict()
        item['id'] = doc.id
        
        data_ultima = datetime.strptime(item['data_ultima_manutencao'], '%Y-%m-%d')
        proxima_data = data_ultima + timedelta(days=item['periodicidade_dias'])
        
        item['proxima_manutencao'] = proxima_data.strftime('%Y-%m-%d')
        item['status'] = 'ALERTA' if proxima_data <= datetime.now() else 'OK'
        
        item['nome_area'] = areas_map.get(item.get('area_id'), 'Área Removida')
        
        lista_processada.append(item)
        
    return jsonify(lista_processada)

@app.route('/api/manutencao', methods=['POST'])
def registrar_manutencao():
    data = request.json
    equipamento_id = data.get('equipamento_id') 
    data_hoje = datetime.now().strftime('%Y-%m-%d')
    
    try:
        equipamento_ref = db.collection('equipamentos').document(equipamento_id)
        equipamento_ref.update({'data_ultima_manutencao': data_hoje})

        db.collection('manutencoes').add({
            'equipamento_id': equipamento_id,
            'data_realizacao': data_hoje,
            'detalhes': 'Manutenção registrada pelo usuário.'
        })
        
        return jsonify({'message': 'Manutenção registrada e data atualizada!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    # BACK-END RODA NA PORTA 3000 E SERVE O FRONT-END
    app.run(debug=True, port=3000)