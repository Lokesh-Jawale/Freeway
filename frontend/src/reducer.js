export const initialState = {
    basket: [],
    user: null,
    donatedItems: [],
    inProcessItems: [],
    requestedItems: [],
    messages: [],
    requestedItemId: null,
    requestedItem: null,
};

const reducer = (state, action) => {
    switch(action.type){
        case 'ADD_TO_BASKET':
            // Logic for adding item to basket
            return { 
                ...state,
                basket: action.item,
            };

        case 'ADD_TO_ALL':
            // Logic for adding item to basket
            const filteredDonatedItems = action.item.filter(item => state.user?.email === item.donatedBy)
            const filteredRequestedItems = action.item.filter(item => {
                return state.user?.requestedItems?.includes(item._id) 
                && state.user?.email !== item.donatedBy
            })

            return { 
                ...state,
                donatedItems: filteredDonatedItems,
                basket: action.item,
                requestedItems: filteredRequestedItems,
            };
    

        case 'ADD_TO_INPROCESSITEMS':
            // Logic for adding inprocess item by user to his inprocess chat list
            return { 
                ...state,
                inProcessItems: [...state.inProcessItems, action.item],
            };

        case 'ADD_TO_REQUESTEDITEMS':
            // Logic for adding recieved items by user to his recieved item list
            return { 
                ...state,
                requestedItems: [...state.requestedItems, action.item],
            };

        case 'REMOVE_FROM_BASKET':
            // Logic for removing given away or deleted item from basket

            let newBasket = [...state.basket];
            const index= state.basket.findIndex((basketItem) => basketItem.id === action.id);

            if(index >= 0){
                // item exist in basket, remove it....
                newBasket.splice(index, 1);
            }
            
            return {
                ...state,
                basket: newBasket,
            };
        
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            };

        case 'SET_REQUESTED_ITEM_ID':
            return {
                ...state,
                requestedItemId: action.requestedItemId,
            }

        case 'SET_REQUESTED_ITEM':
            return {
                ...state,
                requestedItem: action.requestedItem,
            }

        case 'ADD_TO_MESSAGES':
            return {
                ...state,
                messages: [...state.messages, action.item],
            }

        case 'REMOVE_REQUESTEDITEMS':
            return {
                ...state,
                requestedItems: [],
                inProcessItems: [],
            }

        case 'EMPTY':
            return {
                ...state,
                basket: [],
                donatedItems: [],
                recievedItem:[],
                inProcessItems: [],
            }
        
        case 'EMPTY_BASKET':
            return {
                ...state,
                basket: [],
            }

        default:
            return state;
    }
}

export default reducer;
