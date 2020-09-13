import { TextField, InputAdornment, Tooltip, IconButton } from '@material-ui/core';
import React, { FC } from 'react';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface SearchAreaProps {
    searching: boolean;
    searchText: string;
    setSearching: (searching: boolean) => void;
    setSearchText: (searchText: string) => void;
}

const SearchArea: FC<SearchAreaProps> = ({ searching, searchText, setSearching, setSearchText }) => {
    return searching ? (
        <SearchContainer>
            <TextField
                id="search-bar"
                autoFocus
                variant="filled"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                label="Search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <Tooltip placement="bottom" title="Close search" arrow>
                <IconButton onClick={() => setSearching(false)}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </SearchContainer>
    ) : (
        <Tooltip placement="left" title="Search all files and folders" arrow>
            <IconButton onClick={() => setSearching(true)}>
                <SearchIcon />
            </IconButton>
        </Tooltip>
    );
};

export default SearchArea;
