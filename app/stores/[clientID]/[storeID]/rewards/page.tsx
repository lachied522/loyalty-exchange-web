import RewardsList from "./components/rewards-list";



export default function RewardsPage() {


    return (
        <div className='min-h-[540px] flex flex-col items-stretch justify-start md:p-6 p-2 gap-6'>
            <div>
                <div className='text-xl font-semibold'>Rewards</div>
                <p>
                    Add, edit, or remove the rewards available at your store.
                </p>
            </div>

            <RewardsList />
        </div>
    )
}