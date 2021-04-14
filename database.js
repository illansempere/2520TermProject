let Database = {
    '1': {
        reminders: [{
            id: 1,
            title: 'jimmy default',
            date: 'N/A',
            description: 'placeholder default reminder',
            subtasks: '-nothing',
            tags: '-default',
            locationbool: 'false',
            location: {
                address: '',
                city: '',
                stateprovince: '',
                country: ''
            },
            completed: false
        }]
    },
    '2': {
        reminders: [{
            id: 1,
            title: 'johnny default',
            date: 'N/A',
            description: 'placeholder default reminder',
            subtasks: '-nothing',
            tags: '-default',
            locationbool: 'false',
            location: {
                address: '',
                city: '',
                stateprovince: '',
                country: ''
            },
            completed: false
        }]
    },
    '3': {
        reminders: [{
            id: 1,
            title: 'jonathan default',
            date: 'N/A',
            description: 'placeholder default reminder',
            subtasks: '-nothing',
            tags: '-default',
            locationbool: 'false',
            location: {
                address: '',
                city: '',
                stateprovince: '',
                country: ''
            },
            completed: false
        }]
    },
    '4': {
        reminders: [{
            id: 1,
            title: 'aidan default',
            date: 'N/A',
            description: 'placeholder default reminder',
            subtasks: '-nothing',
            tags: '-default',
            locationbool: 'true',
            location: {
                address: '6361 Hammond Bay Rd',
                city: 'Nanaimo',
                stateprovince: 'BC',
                country: 'Canada'
            },
            completed: false
        }]
    },
    '5': {
        reminders: [{
            id: 1,
            title: 'illan default',
            date: 'N/A',
            description: 'placeholder default reminder',
            subtasks: '-nothing',
            tags: '-default',
            locationbool: 'false',
            location: {
                address: '',
                city: '',
                stateprovince: '',
                country: ''
            },
            completed: false
        }]
    },
}

function AddUser(id) {
    Database[id] = { reminders: [] }
}

module.exports = { Database, AddUser };