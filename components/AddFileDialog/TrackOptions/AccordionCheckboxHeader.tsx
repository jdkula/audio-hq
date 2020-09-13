/**
 * TrackOptions/AccordionCheckboxHeader.tsx
 * ========================
 * Provides an AccordionSummary with a checkbox.
 */

import { AccordionSummary, Checkbox, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { FC } from 'react';
import styled from 'styled-components';

const AccordionCheckboxContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface AccordionCheckboxHeaderProps {
    id: string;
    label: string;

    checked: boolean;
    setChecked: (checked: boolean) => void;
}

const AccordionCheckboxHeader: FC<AccordionCheckboxHeaderProps> = ({ checked, setChecked, id, label }) => {
    return (
        <AccordionSummary expandIcon={<ExpandMore />} id={`${id}-header`} aria-controls={`${id}-controls`}>
            <AccordionCheckboxContainer>
                <Checkbox
                    aria-label={`${label} Checkbox`}
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    onChange={(e) => setChecked(e.currentTarget.checked)}
                    checked={checked}
                />
                <Typography>{label}</Typography>
            </AccordionCheckboxContainer>
        </AccordionSummary>
    );
};

export default AccordionCheckboxHeader;
