/**
 * SearchBar.tsx
 * ===============
 * Provides a search bar for the explorer!
 */

import { Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface SearchBarProps {
    searching: boolean;
    searchText: string;
    setSearching: (searching: boolean) => void;
    setSearchText: (searchText: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ searching, searchText, setSearching, setSearchText }) => {
    const [searchTextInternal, setSearchTextInternal] = useState('');

    useEffect(() => {
        if (searchText !== searchTextInternal && searchText) {
            setSearchText('');
        }
    }, [searchTextInternal, searchText, setSearchText]);

    return searching ? (
        <SearchContainer>
            <TextField
                id="search-bar"
                autoFocus
                variant="filled"
                value={searchTextInternal}
                onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                        setSearchText(searchTextInternal);
                        e.preventDefault();
                    }
                }}
                onChange={(e) => setSearchTextInternal(e.target.value)}
                label="Search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <Button size="small" onClick={() => setSearchText(searchTextInternal)}>
                GO
            </Button>
            <Tooltip placement="bottom" title="Close search" arrow>
                <IconButton onClick={() => setSearching(false)} size="large">
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </SearchContainer>
    ) : (
        <Tooltip placement="left" title="Search all files and folders" arrow>
            <IconButton onClick={() => setSearching(true)} size="large">
                <SearchIcon />
            </IconButton>
        </Tooltip>
    );
};

export default SearchBar;
