from pymongo import MongoClient
from datetime import datetime
import arrow

count_elements = lambda elements: {element:elements.count(element) for element in set(elements)}
time_diff_ISO = lambda timeServer, timeClient: int(str(arrow.get(timeServer).datetime - arrow.get(timeClient).datetime)[6:-3].replace('.', ''))
mean = lambda l: int(sum(l) / len(l))

def connections_stats(db):
    connections = list(db.connections.find())

    # dict of cities
    print('List of connections by cities:')
    print(count_elements([e['ip']['city'] for e in connections]))

    # dict of operators
    print('List of connections by operators:')
    print(count_elements([e['ip']['asn_org'] for e in connections]))

    # dict of operators
    print('List of connections by connection type:')
    print(count_elements([e['ip']['connection_type'] for e in connections]))


def messages_stats(db):
    messages = list(db.messages.find())

    # mean ping by users
    users = set([e['from'] for e in messages])
    print('Mean ping of each users (in ms):')
    print({
        user: 
        mean([
            (
                time_diff_ISO(message['dateServer'], message['dateClient'])
                # datetime.strptime(message['dateClient'], "%Y-%m-%dT%H:%M:%SZ"), 
                # datetime.strptime(message['dateServer'], "%Y-%m-%dT%H:%M:%SZ")
            ) 
            for message in messages 
            if message['from'] == user
        ])
        for user in users
    })


def users_stats(db):
    users = list(db.users.find())

if __name__ == "__main__":
    client = MongoClient(port=27020)
    db = client.chat_server
    
    try:
        print('==== Connections Stats ====')
        connections_stats(db)
    except:
        print('error with collection \'connections\'')    
    
    try:
        print('==== Messages Stats ====')
        messages_stats(db)
    except:
        print('error with collection \'messages\'')    
    
    try:
        print('==== Users Stats ====')
        users_stats(db)
    except:
        print('error with collection \'users\'')

