import { ListContactCard } from "./ListContactCard"

export function SingleComponents() {
  return (
    <main>
      <ListContactCard
        firstname="Dozer"
        lastname="Jackson"
        formal={false}
        navUrl="anywhere"
        extra="(321) 555-1234"
        imageUrl="https://randomuser.me/api/portraits/thumb/men/59.jpg"
      />
      <ListContactCard
        firstname="Dozer"
        lastname="Jackson"
        formal={false}
        navUrl="anywhere"
        extra="(321) 555-1234"
        imageUrl="https://randomuser.me/api/portraits/thumb/men/59.jpg"
      />
      <ListContactCard
        firstname="Dozer"
        lastname="Jackson"
        formal={false}
        navUrl="anywhere"
        extra="(321) 555-1234"
        imageUrl="https://randomuser.me/api/portraits/thumb/men/59.jpg"
      />
    </main>
  )
}
