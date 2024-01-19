<template>
    <!-- Main container for schedule buttons and associated options -->
    <div class="schedule-button-container">
        <!-- Button to toggle input field for adding schedule links -->
        <button class="action-button" @click="toggleInputField">Add to Schedule</button>
        <!-- Input field for adding schedule links, visible when inputVisible is true -->
        <input v-if="inputVisible" type="text" v-model="link" class="link-input" placeholder="Enter link here"
            @keyup.enter="saveLink" />

        <!-- Button to toggle diet options menu -->
        <button class="action-button" @click="toggleDietOptions">Diet</button>
        <!-- Diet options, displayed when showDietOptions is true -->
        <div v-if="showDietOptions" class="dietOptions">
            <!-- Buttons for each diet option, toggles selection state on click -->
            <button v-for="(selected, diet) in diets" :key="diet" :class="{ active: selected }" @click="selectDiet(diet)">
                {{ diet }}
            </button>
        </div>

        <!-- Button to toggle widget options menu -->
        <button class="action-button" @click="toggleWidgetOptions">Widgets</button>
        <!-- Disclaimer for widget selection, visible when showWidgetOptions is true -->
        <p v-if="showWidgetOptions" class="disclaimer">Choose up to 2 widgets:</p>
        <!-- Widget options, displayed when showWidgetOptions is true -->
        <div v-if="showWidgetOptions" class="widgetOptions">
            <!-- Buttons for each widget option, toggles selection state on click -->
            <button v-for="(selected, widget) in widgets" :key="widget" :class="{ active: selected }"
                @click="selectWidget(widget)">
                {{ widget }}
            </button>
        </div>

        <!-- Button to toggle association options menu -->
        <button class="action-button" @click="toggleAssociationOptions">Associations</button>
        <!-- Association options, displayed when showAssociationOptions is true -->
        <div v-if="showAssociationOptions" class="associationOptions">
            <!-- Buttons for each association option, toggles selection state on click -->
            <button v-for="(selected, association) in associations" :key="association" :class="{ active: selected }"
                @click="selectAssociation(association)">
                {{ association }}
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'AddScheduleButton',
    data() {
        // Component state variables
        return {
            inputVisible: false,  // Controls visibility of the link input field
            link: '',             // Stores the schedule link input by the user
            showDietOptions: false,  // Controls visibility of diet options menu
            diets: { Milk: false, Laktos: false, Vege: false, Gluten: false },  // Diet options state
            showWidgetOptions: false,  // Controls visibility of widget options menu
            widgets: { Schedule: false, Menu: false, Events: false, Weather: false },  // Widget options state
            showAssociationOptions: false,  // Controls visibility of association options menu
            associations: { TLK: false, HanSe: false, Hosk: false, Kult: false, Commedia: false },  // Association options state
        };
    },
    methods: {
        // Toggles visibility of the link input field
        toggleInputField() {
            this.inputVisible = !this.inputVisible;
        },
        // Saves the entered link to local storage and hides the input field
        saveLink() {
            const userId = localStorage.getItem('userId');
            axios.put(`http://localhost:3000/api/updateLink`, { userId, link: this.link })
                .then(() => {
                    this.inputVisible = false;
                    this.link = '';
                })
                .catch(error => console.error('Error updating link:', error));
        },
        // Toggles visibility of diet options menu
        toggleDietOptions() {
            this.showDietOptions = !this.showDietOptions;
        },
        // Toggles selection state of a diet option and updates local storage
        selectDiet(diet) {
            this.diets[diet] = !this.diets[diet];
            const userId = localStorage.getItem('userId');
            axios.put(`http://localhost:3000/api/updateDiets`, { userId, diets: this.diets })
                .then(() => {
                    // Handle success
                })
                .catch(error => console.error('Error updating diets:', error));
        },
        // Toggles visibility of widget options menu
        toggleWidgetOptions() {
            this.showWidgetOptions = !this.showWidgetOptions;
        },
        // Toggles selection state of a widget and limits selection to 2 widgets
        selectWidget(widget) {
            // ... modified code for selecting widget ...
            const userId = localStorage.getItem('userId');
            axios.put(`http://localhost:3000/api/updateWidget`, { userId, widgets: this.widgets })
                .catch(error => console.error('Error updating widgets:', error));
        },
        // Counts the number of selected widgets
        countSelectedWidgets() {
            return Object.values(this.widgets).filter(val => val).length;
        },
        // Toggles visibility of association options menu
        toggleAssociationOptions() {
            this.showAssociationOptions = !this.showAssociationOptions;
        },
        // Selects an association and updates local storage, allowing only one selection
        selectAssociation(association) {
            // ... modified code for selecting association ...
            const userId = localStorage.getItem('userId');
            axios.put(`http://localhost:3000/api/updateAssociations`, { userId, associations: this.associations })
                .catch(error => console.error('Error updating associations:', error));
        },
    },
    mounted() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            axios.get(`http://localhost:3000/api/getUserSettings/${userId}`)
                .then(response => {
                    const settings = response.data;
                    if (settings.diets) {
                        this.diets = settings.diets;
                    }
                    if (settings.widgets) {
                        this.widgets = settings.widgets;
                    }
                    if (settings.associations) {
                        this.associations = settings.associations;
                    }
                })
                .catch(error => console.error('Error fetching user settings:', error));
        }
 } };
</script>
  
<style scoped>
.schedule-button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 400px;
    gap: 40px;
}

.action-button {
    background-color: #4054B2;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 15px 30px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;

}

.action-button:hover {
    background-color: #2D3A8C;
}

.link-input {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    width: 90%;
    margin-top: 10px;
}

.dietOptions button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.dietOptions button.active {
    background-color: #4CAF50;
    color: white;
}

.dietOptions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.widgetOptions button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.widgetOptions button.active {
    background-color: #4CAF50;
    color: white;
}

.widgetOptions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.widgetOptions .disclaimer {
    margin-bottom: 10px;
    font-size: 0.9em;
    color: #666;
}

.disclaimer {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 0.9em;
    color: white;
}

.associationOptions button {
    /* combine these with rest of css */

    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.associationOptions button.active {

    background-color: #4CAF50;
    color: white;
}

.associationOptions {

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}
</style>
  