/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import { Component } from 'react';
import {
    DropTarget,
    ConnectDropTarget,
    DropTargetMonitor,
    XYCoord,
    DropTargetConnector,
} from 'react-dnd';
import update from 'immutability-helper';
import equals from 'fast-deep-equal';
import { Boxes } from '../../types/Portfolio';
// eslint-disable-next-line import/no-cycle
import { BoxDragItem } from '../../constants/types';
// eslint-disable-next-line import/no-cycle
import { WidgetComponentType } from '../widgets/IWidget';
import { IInitialState } from '../../reducers/portfolio';

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
    hovered;
    hideSourceOnDrag: boolean;
    connectDropTarget: ConnectDropTarget;
    updateActiveWidgets: (id: string, active: boolean) => void;
    setThemePanel: (node: React.ReactNode) => void;
    background: string;
    gradient: string | undefined;
    angleValue: number;
    colorPercent: number;
    updatePortfolioBoxes: (boxes: Boxes) => void;
    portfolio: IInitialState;
}

interface IState {
    boxes: Boxes;
}

// export function deleteBox(this: any, id) {
//     // Handle removal of a widget from the page
//     this.setState(
//         update(this.state, {
//             boxes: {
//                 $merge: {
//                     [id]: undefined,
//                 },
//             },
//         })
//     );
// }

class Portfolio extends Component<IProps, IState> {
    props!: IProps;

    state: IState;

    constructor(props) {
        super(props);
        console.log(props);
        if (Object.keys(props.portfolio.boxes).length > 0) {
            this.state = {
                boxes: props.portfolio.boxes,
            };
        } else {
            this.state = {
                boxes: {},
            };
        }
    }

    componentDidUpdate(_, prevState) {
        if (!equals(this.state, prevState)) {
            this.props.updatePortfolioBoxes(this.state.boxes);
        }
    }

    deleteBox = (id: string) => {
        // Handle removal of a widget from the page
        this.setState(
            update(this.state, {
                boxes: {
                    $unset: [id],
                },
            })
        );
        this.props.updateActiveWidgets(id, false);
    };

    moveBox(id: string, left: number, top: number) {
        this.setState(
            update(this.state, { boxes: { [id]: { $merge: { left, top } } } })
        );
    }

    addBox(id, left, top, component: WidgetComponentType, data: any) {
        this.setState(
            update(this.state, {
                boxes: {
                    $merge: {
                        [id]: { title: 'hi', left, top, component, data },
                    },
                },
            })
        );
        this.props.updateActiveWidgets(id, true);
    }

    temp(node: React.ReactNode) {
        return node;
    }

    render() {
        // eslint-disable-next-line prettier/prettier
        const { hideSourceOnDrag, connectDropTarget, hovered } = this.props;
        //const backgroundColor = hovered ? '#F0F02D' : 'white';
        const backgroundColor = hovered ? '0px 0px 40px black' : '';
        const { boxes } = this.state;
        const { background, gradient, angleValue, colorPercent } = this.props;
        const gradientColor = gradient || background;
        return connectDropTarget(
            <div className="portfolio">
                <div
                    className="portfolio__page"
                    id="portfolio"
                    style={{
                        boxShadow: backgroundColor,
                        position: 'relative',
                        backgroundImage: `linear-gradient(${angleValue}deg, ${background} ${colorPercent}%, ${gradientColor})`,
                    }}
                >
                    {/* <p style={{ color: '#000000' }}>This is my page</p> */}
                    {Object.keys(boxes).map((key) => {
                        const { left, top, title, component, data } = boxes[
                            key
                        ];
                        console.log(component);
                        const WidgetComponent = component;
                        return (
                            <WidgetComponent
                                key={key}
                                id={key}
                                left={left}
                                top={top}
                                setThemePanel={this.props.setThemePanel}
                                hideSourceOnDrag={hideSourceOnDrag}
                                data={data}
                                delete={this.deleteBox}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}
export default DropTarget(
    'widget',
    {
        drop(
            props: IProps,
            monitor: DropTargetMonitor,
            component: Portfolio | null
        ) {
            if (!component) {
                return;
            }

            const item = monitor.getItem<BoxDragItem>();
            if (!component.state.boxes[item.id]) {
                const delta = monitor.getClientOffset() as XYCoord;
                const left = Math.round(delta.x - 64 - 225); // TODO figure out where this value (64) comes from. It will cause issues if we change the styling
                const top = Math.round(delta.y - 64);
                component.addBox(item.id, left, top, item.component, item.data);
            } else {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
                const left = Math.round(item.left + delta.x);
                const top = Math.round(item.top + delta.y);
                component.moveBox(item.id, left, top);
            }
        },
    },
    collect
)(Portfolio);
