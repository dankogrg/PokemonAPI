export default class Pokemon {
    // Properties
    rootElement = null;
    searchInputElement = null;
    searchBtnElement = null;
    resultElement = null;

    constructor(root, options = {}) {
        // Default options
        const defaultOptions = {
            searchInputCssClass: options.searchInputCssClass ?? "form-control",
            searchBtnCssClass:
                options.searchBtnCssClass ?? "btn btn-primary mt-2",
            resultCssClass: options.resultCssClass ?? "table",
        };

        this.init(root, defaultOptions);
    }

    // Inicijalizacija aplikacije
    init = (root, defaultOptions) => {
        this.initDOM(root, defaultOptions);
        this.initEventListeners();
    };

    // Inicijalizacija DOM-a (kreira potrebne DOM elemente i umetne ih u postojećo DOM)
    initDOM = (root, defaultOptions) => {
        try {
            this.rootElement = document.querySelector(root);
            if (!this.rootElement) {
                throw "Can't load root element from DOM!";
            }

            this.searchInputElement = this.createElement(
                "input",
                "text",
                defaultOptions.searchInputCssClass,
                "Search..."
            );
            this.rootElement.append(this.searchInputElement);

            this.searchBtnElement = this.createElement(
                "button",
                "button",
                defaultOptions.searchBtnCssClass,
                "Search..."
            );
            this.rootElement.append(this.searchBtnElement);

            this.resultElement = this.createElement(
                "table",
                null,
                defaultOptions.resultCssClass,
                null
            );
            this.rootElement.append(this.resultElement);
        } catch (error) {
            console.warn(error);
        }
    };

    // Inicijalizacija event listenera
    initEventListeners = () => {
        this.searchBtnElement.addEventListener("click", this.handleSearch);
        this.searchInputElement.addEventListener("keyup", this.handleSearch);
    };

    // LISTENERS
    handleSearch = (event) => {
        if (event.key != "Enter" && event.key != undefined) {
            return;
        }

        if (!this.searchInputElement.value.trim()) {
            alert("Please enter a search term!");
            return;
        }

        try {
            this.searchInputElement.disabled = true;
            this.searchBtnElement.disabled = true;
            this.searchBtnElement.innerHTML +=
                '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';

            const result = this.searchPokemons(
                this.searchInputElement.value.trim().toLowerCase()
            );

            result
                .then((data) => this.showData(data))
                .catch(() => (this.resultElement.innerHTML = "No results!!"))
                .finally(() => {
                    this.searchInputElement.disabled = false;
                    this.searchBtnElement.disabled = false;
                    this.searchBtnElement.innerHTML = "Search...";
                });
        } catch (error) {
            console.warn("Something went wrong!!!");
        }
    };

    // SERVICES
    searchPokemons = async (term) => {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${term}`
        );

        return response.json();
    };

    // HELPERS
    createElement = (elementName, elementType, className, text) => {
        const element = document.createElement(elementName);

        if (elementType) {
            element.type = elementType;
        }

        if (text) {
            if (element.placeholder != undefined) {
                element.placeholder = text;
            } else {
                element.innerText = text;
            }
        }

        element.className = className;

        return element;
    };

    showData = (data) => {
        const tHead = `
            <thead>
                <tr>
        	        <th>Picture</th>
        	        <th>Id</th>
        	        <th>Name</th>
        	        <th>Abilities</th>
                </tr>
            </thead>
        `;
        const tBody = `
            <tbody>
                <tr>
                    <td>
                        <img src="${data.sprites.front_default}" />
                    </td>
                    <td>${data.id}</td>
                    <td>${data.name}</td>
                    <td>${data.abilities.map(
                        (object) => " " + object.ability.name
                    )}</td>
                </tr>
            </tbody>
        `;

        const table = tHead + tBody;

        this.resultElement.innerHTML = table;
    };
}
