import React from 'react';
import ReactDOM from 'react-dom';
import ProfileButton from "./components/ProfileButton/ProfileButton"
import './index.css';
import Tree from './Tree/Tree';
import {useGenealogy} from "./context/GenealogyContext";

function App() {
    const { genealogy } = useGenealogy();

    return (
        <>
            <ProfileButton />
            <div className={"tree-main"}>
                <Tree
                    root = '???'
                    datalist = {JSON.parse(JSON.stringify(genealogy))} />
            </div>

        </>
    );
}

export default App;

