import { createGlobalState } from "react-hooks-global-state";

const {setGlobalState, useGlobalState} = createGlobalState({
    loggin: false,
    email: '',
    username: '',
})

export { useGlobalState, setGlobalState}
