import React, { useMemo } from "react";
import { ReactComponent as Pen } from "@/assets/icons/common/pen.svg";
import clsx from "clsx";
import useBlockchainStore from "@/hooks/store/useBlockchainStore";
import { formatSecondsLeftInDaysHours } from "@/ui/components/cityview/realm/labor/laborUtils";
import { ResourceCost } from "@/ui/elements/ResourceCost";
import { getTotalResourceWeight } from "../cityview/realm/trade/utils";
import { divideByPrecision } from "@/ui/utils/utils";
import { useGetOwnedEntityOnPosition, useResources } from "@/hooks/helpers/useResources";
import Button from "@/ui/elements/Button";
import { useDojo } from "@/hooks/context/DojoContext";
import { TravelEntityPopup } from "./TravelEntityPopup";
import { useEntities } from "@/hooks/helpers/useEntities";
import { ENTITY_TYPE } from "@bibliothecadao/eternum";

const entityIcon: Record<ENTITY_TYPE, string> = {
  [ENTITY_TYPE.DONKEY]: "🫏",
  [ENTITY_TYPE.TROOP]: "🥷",
  [ENTITY_TYPE.UNKNOWN]: "❓", // Add a default or placeholder icon for UNKNOWN
};

type EntityProps = {
  entityId: bigint;
  idleOnly?: boolean;
  selectedCaravan?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const Entity = ({ entityId, ...props }: EntityProps) => {
  const { getEntityInfo } = useEntities();
  const entityInfo = getEntityInfo(entityId);
  const { position, arrivalTime, blocked, capacity, resources, entityType } = entityInfo;

  const nextBlockTimestamp = useBlockchainStore((state) => state.nextBlockTimestamp);
  const {
    account: { account },
    setup: {
      systemCalls: { send_resources },
    },
  } = useDojo();

  const [isLoading, setIsLoading] = React.useState(false);
  const [showTravel, setShowTravel] = React.useState(false);

  const { getResourcesFromBalance } = useResources();

  const entityResources = getResourcesFromBalance(entityId);
  const depositEntityIds = position ? useGetOwnedEntityOnPosition(BigInt(account.address), position) : [];
  const depositEntityId = depositEntityIds[0];

  // capacity
  let resourceWeight = useMemo(() => {
    return getTotalResourceWeight([...entityResources]);
  }, [entityResources]);

  const hasResources = entityResources.length > 0;

  const isTraveling =
    !blocked && nextBlockTimestamp !== undefined && arrivalTime !== undefined && arrivalTime > nextBlockTimestamp;
  const isWaitingForDeparture = blocked;
  const isIdle = !isTraveling && !isWaitingForDeparture && !resourceWeight;
  const isWaitingToOffload = !blocked && !isTraveling && resourceWeight > 0;
  if ((blocked || isTraveling) && props.idleOnly) {
    return null;
  }

  const onOffload = async (receiverEntityId: bigint) => {
    setIsLoading(true);
    if (entityId && hasResources) {
      await send_resources({
        sender_entity_id: entityId,
        recipient_entity_id: receiverEntityId,
        resources: entityResources.flatMap((resource) => [resource.resourceId, resource.amount]),
        signer: account,
      }).finally(() => setIsLoading(false));
    }
  };

  const onCloseTravel = () => {
    setShowTravel(false);
  };

  return (
    <div
      className={clsx("flex flex-col p-2 border rounded-md border-gray-gold text-xxs text-gray-gold", props.className)}
      onClick={props.onClick}
    >
      {showTravel && <TravelEntityPopup entityId={entityId} onClose={onCloseTravel} />}
      <div className="flex items-center text-xxs">
        <div className="flex items-center p-1 -mt-2 -ml-2 italic border border-t-0 border-l-0 text-light-pink rounded-br-md border-gray-gold">
          #{Number(entityId)}
        </div>
        <div className="flex items-center ml-1 -mt-2">
          {!isTraveling && (
            <div className="flex items-center ml-1">
              <span className="italic text-light-pink">{`Waiting`}</span>
            </div>
          )}
          {/* when you are not trading (trading is round trip) it means you are either going to/coming from bank/hyperstructure */}
          {isTraveling && (
            <div className="flex items-center ml-1">
              <span className="italic text-light-pink">{`Traveling`}</span>
            </div>
          )}
        </div>
        {isWaitingForDeparture && (
          <div className="flex ml-auto -mt-2 italic text-gold">
            Trade Bound <Pen className="ml-1 fill-gold" />
          </div>
        )}
        {isWaitingToOffload && <div className="flex ml-auto -mt-2 italic text-gold">Waiting to offload</div>}
        {isIdle && (
          <div className="flex ml-auto -mt-2 italic text-gold">
            Idle
            <Pen className="ml-1 fill-gold" />
          </div>
        )}
        {arrivalTime && isTraveling && nextBlockTimestamp && (
          <div className="flex ml-auto -mt-2 italic text-light-pink">
            {formatSecondsLeftInDaysHours(arrivalTime - nextBlockTimestamp)}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center space-x-2 flex-wrap mt-2">
        {!isIdle &&
          !isWaitingForDeparture &&
          resources &&
          resources.map(
            (resource) =>
              resource && (
                <ResourceCost
                  key={resource.resourceId}
                  className="!text-gold !w-5 mt-0.5"
                  type="vertical"
                  resourceId={resource.resourceId}
                  amount={divideByPrecision(resource.amount)}
                />
              ),
          )}
      </div>
      <div className="flex w-full mt-2">
        <div className="grid w-full grid-cols-1 gap-5">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mt-[6px] text-xxs">
              <div className="text-xl">{entityIcon[entityType]}</div>
              <div className="">
                {hasResources && depositEntityId !== undefined && (
                  <Button
                    size="xs"
                    className="ml-auto"
                    isLoading={isLoading}
                    disabled={isTraveling}
                    onClick={() => onOffload(depositEntityId)}
                    variant="success"
                    withoutSound
                  >
                    {`Deposit Resources`}
                  </Button>
                )}
                {/* {!isTraveling && !blocked && (
                  <Button size="xs" className="ml-auto" onClick={() => setShowTravel(true)} variant={"success"}>
                    {"Travel"}
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};